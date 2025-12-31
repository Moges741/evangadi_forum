import React from "react";
import { Bot } from "lucide-react";
import styles from "./TypingIndicator.module.css";

function TypingIndicator() {
  return (
    <div className={styles.container}>
      {/* Bot Avatar */}
      <div className={styles.avatar}>
        <Bot size={16} className={styles.botIcon} />
      </div>

      {/* Bubble with bouncing dots */}
      <div className={styles.bubble}>
        <div className={styles.dotContainer}>
          <Dot delay="0s" />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </div>
      </div>
    </div>
  );
}

const Dot = ({ delay }) => (
  <div className={styles.dot} style={{ animationDelay: delay }}></div>
);

export default TypingIndicator;
