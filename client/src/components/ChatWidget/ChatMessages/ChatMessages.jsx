import React from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import styles from "./ChatMessages.module.css";

function ChatMessages({ messages }) {
  if (messages.length === 0) return <LandingScreen />;

  return (
    <div className={styles.container}>
      {messages.map(({ human, model }, index) => (
        <React.Fragment key={index}>
          <MessageItem role="user" content={human} />
          {model && <MessageItem role="model" content={model} />}
        </React.Fragment>
      ))}
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
      {/* Avatar Container */}
      <div
        className={`${styles.avatar} ${
          isUser ? styles.userAvatar : styles.botAvatar
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Bubble */}
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
