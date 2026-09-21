interface ModelOption {
  value: string;
  label: string;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  model?: string;
  onModelChange?: (model: string) => void;
  models?: ModelOption[];
}

function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  model,
  onModelChange,
  models,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="chat-input-container">
      {models && model && onModelChange && (
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={disabled}
          className="model-select"
        >
          {models.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入问题..."
        disabled={disabled}
        className="chat-input"
      />
      <button onClick={onSend} disabled={disabled} className="send-button">
        发送
      </button>
    </div>
  );
}

export default ChatInput;
