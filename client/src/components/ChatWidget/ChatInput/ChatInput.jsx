import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./ChatInput.module.css";

function ChatInput({ onSubmit, isBotTyping }) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea height as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      // Limit height to 150px before scrolling starts
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [prompt]);

  const handleSend = (e) => {
    if (e) e.preventDefault();

    if (prompt.trim() && !isBotTyping) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  const onKeyDown = (e) => {
    // Submit on "Enter" but allow new lines on "Shift + Enter"
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isValid = prompt.trim().length > 0;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSend} className={styles.form}>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message AI..."
          className={styles.textarea}
          rows={1}
          maxLength={500}
        />

        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            disabled={!isValid || isBotTyping}
            className={`${styles.sendButton} ${
              isValid && !isBotTyping
                ? styles.activeButton
                : styles.disabledButton
            }`}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
