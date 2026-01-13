import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, Trash2 } from "lucide-react";
import axios from "../../../Api/axiosConfig";
import styles from "./ChatMessages.module.css";

function ChatMessages({ messages, setMessages }) {
  const [confirmClear, setConfirmClear] = useState(false);

  if (messages.length === 0) return <LandingScreen />;

  const handleClearChat = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete("/chat/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages([]); // instantly clear UI
    } catch (error) {
      console.error("Failed to clear chat history", error);
      alert("Failed to clear chat history");
    } finally {
      setConfirmClear(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Clear chat button */}
      <div className={styles.clearRow}>
        <button
          className={styles.clearBtn}
          onClick={() => setConfirmClear(true)}
          title="Clear chat history"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Confirmation Overlay */}
      {confirmClear && (
        <div className={styles.confirmation_overlay}>
          <div
            className={styles.confirmation_prompt}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-clear-label"
          >
            <p id="confirm-clear-label">
              Are you sure you want to delete all chat history?
              <br />
              <strong>This action cannot be undone.</strong>
            </p>

            <button
              type="button"
              className={`${styles.confirmation_btn} ${styles.confirmation_btn_danger}`}
              onClick={handleClearChat}
            >
              Yes, Delete
            </button>

            <button
              type="button"
              className={`${styles.confirmation_btn} ${styles.confirmation_btn_secondary}`}
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {messages.map(({ human, model }, index) => (
          <React.Fragment key={index}>
            <MessageItem role="user" content={human} />
            {model && <MessageItem role="model" content={model} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function MessageItem({ content, role }) {
  const isUser = role === "user";

  return (
    <div
      className={`${styles.messageRow} ${
        isUser ? styles.userRow : styles.botRow
      }`}
    >
      <div
        className={`${styles.avatar} ${
          isUser ? styles.userAvatar : styles.botAvatar
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={`${styles.bubble} ${
          isUser ? styles.userBubble : styles.botBubble
        }`}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function LandingScreen() {
  return (
    <div className={styles.landing}>
      <div className={styles.landingIcon}>
        <Bot size={32} color="#4b6bfb" />
      </div>
      <p>How can I help you today?</p>
    </div>
  );
}

export default ChatMessages;
