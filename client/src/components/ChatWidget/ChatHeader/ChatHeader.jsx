import { Minus } from "lucide-react"; // Minus looks cleaner for minimizing
import styles from "./ChatHeader.module.css";

function ChatHeader({ isBotTyping, onClose }) {
  return (
    <div className={styles.header}>
      <div className={styles.indicatorWrapper}>
        <div
          className={`${styles.statusDot} ${
            isBotTyping ? styles.typing : styles.idle
          }`}
        ></div>

        {isBotTyping && (
          <div className={`${styles.ping} ${styles.typing}`}></div>
        )}
      </div>

      <div className={styles.info}>
        <h2>Evangadi AI Assistant</h2>
        <p>{isBotTyping ? "Generating answer..." : "Online & Ready to help"}</p>
      </div>

      {/* New Close/Minimize Button */}
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Minimize chat"
      >
        <Minus size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default ChatHeader;
