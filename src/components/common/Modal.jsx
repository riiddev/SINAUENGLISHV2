import React, { useEffect } from "react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "580px"
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content"
        style={{ maxInlineSize: maxWidth }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela modal"
          style={{
            position: "absolute",
            top: "var(--space-4)",
            right: "var(--space-4)",
            fontSize: "var(--text-lg)",
            fontWeight: "700",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)",
            lineHeight: 1
          }}
        >
          ✕
        </button>
        {title && (
          <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

