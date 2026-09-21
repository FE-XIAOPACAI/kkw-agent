import { useState } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import "./App.css";

interface Step {
  type: "thought" | "action" | "observation" | "answer";
  content: string;
}

interface Message {
  role: "user" | "agent";
  content: string;
  steps?: Step[];
}

const MODELS = [
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "claude-3-5-sonnet", label: "claude-3-5-sonnet" },
  { value: "kimi-k2.7-code", label: "kimi-k2.7-code" },
  { value: "deepseek-v4-pro", label: "deepseek-v4-pro" },
  { value: "qwen3.8-max", label: "qwen3.8-max" },
];

function getStoredSessionId(): string {
  const stored = localStorage.getItem("agent-session-id");
  if (stored) return stored;
  const newId = `session-${Date.now()}`;
  localStorage.setItem("agent-session-id", newId);
  return newId;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].value);
  const [sessionId] = useState<string>(getStoredSessionId());

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const steps: Step[] = [];
    let hasAnswer = false;
    let manuallyClosed = false;
    const eventSource = new EventSource(
      `/chat/stream?sessionId=${sessionId}&message=${encodeURIComponent(userMessage)}&model=${encodeURIComponent(model)}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        manuallyClosed = true;
        eventSource.close();
        setIsLoading(false);
        if (!hasAnswer) {
          setMessages((prev) => [
            ...prev,
            { role: "agent", content: "（未收到最终答案）", steps: [...steps] },
          ]);
        }
        return;
      }

      try {
        const data = JSON.parse(event.data) as Step;
        steps.push(data);

        if (data.type === "answer") {
          hasAnswer = true;
          setMessages((prev) => [
            ...prev,
            { role: "agent", content: data.content, steps: [...steps] },
          ]);
          manuallyClosed = true;
          eventSource.close();
          setIsLoading(false);
        }
      } catch (error) {
        console.error("SSE 数据解析失败:", event.data, error);
      }
    };

    eventSource.onerror = (error) => {
      if (manuallyClosed) return;
      console.error("SSE 连接错误:", error);
      eventSource.close();
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "连接出错，请稍后重试。" },
      ]);
    };
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 Agent Chat</h1>
      </header>
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="empty-state">输入问题，开始和 Agent 对话</div>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && <div className="loading">Agent 思考中...</div>}
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isLoading}
        model={model}
        onModelChange={setModel}
        models={MODELS}
      />
    </div>
  );
}

export default App;
