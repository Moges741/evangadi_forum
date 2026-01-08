import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import styles from "./ChatWidget.module.css";
import ChatBot from './ChatBot/ChatBot.jsx'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  // >=> Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.triggerWrapper} ref={widgetRef}>
      {/* The Chat Window */}
      {isOpen && (
        <div className={styles.windowContainer}>
          <ChatBot onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* The Toggle Button */}
      <button
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}

export default ChatWidget;
