import { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ModelSelector from "./components/ModelSelector";
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

interface ModelOption {
  value: string;
  label: string;
}

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
  const [models, setModels] = useState<ModelOption[]>([]);
  const [model, setModel] = useState("");
  const [sessionId] = useState<string>(getStoredSessionId());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    fetch("/models")
      .then((res) => res.json())
      .then((data: ModelOption[]) => {
        setModels(data);
        if (data.length > 0) setModel(data[0].value);
      })
      .catch((error) => console.error("加载模型列表失败:", error));
  }, []);

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
        <ModelSelector
          models={models}
          model={model}
          onModelChange={setModel}
          disabled={isLoading}
        />
      </header>
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="empty-state">输入问题，开始和 Agent 对话</div>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && <div className="loading">Agent 思考中...</div>}
        <div ref={bottomRef} />
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}

export default App;
