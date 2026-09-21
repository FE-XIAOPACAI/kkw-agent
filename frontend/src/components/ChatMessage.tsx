interface Step {
  type: "thought" | "action" | "observation" | "answer";
  content: string;
}

interface ChatMessageProps {
  message: {
    role: "user" | "agent";
    content: string;
    steps?: Step[];
  };
}

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">{message.content}</div>
      {message.steps && message.steps.length > 0 && (
        <div className="steps">
          {message.steps.map((step, index) => (
            <div key={index} className={`step ${step.type}`}>
              <span className="step-type">{step.type}</span>
              <span className="step-content">{step.content}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
