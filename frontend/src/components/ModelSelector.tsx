import { useState, useEffect, useRef } from "react";

interface ModelOption {
  value: string;
  label: string;
}

interface ModelSelectorProps {
  models: ModelOption[];
  model: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

function ModelSelector({
  models,
  model,
  onModelChange,
  disabled,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const current = models.find((m) => m.value === model);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (value: string) => {
    onModelChange(value);
    setOpen(false);
  };

  return (
    <>
      <button
        className="model-selector-button"
        onClick={() => setOpen(true)}
        disabled={disabled || models.length === 0}
        title="切换模型"
      >
        <span className="model-selector-icon">⚙️</span>
        <span className="model-selector-name">
          {current?.label ?? "选择模型"}
        </span>
        <span className="model-selector-arrow">▾</span>
      </button>

      {open && (
        <div className="model-modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="model-modal"
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="model-modal-header">
              <h3>选择模型</h3>
              <button
                className="model-modal-close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="model-modal-list">
              {models.map((m) => (
                <button
                  key={m.value}
                  className={`model-modal-item ${
                    m.value === model ? "active" : ""
                  }`}
                  onClick={() => handleSelect(m.value)}
                >
                  <span>{m.label}</span>
                  {m.value === model && <span className="check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModelSelector;
