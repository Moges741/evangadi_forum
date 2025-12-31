import { AlertCircle, RefreshCw } from "lucide-react";
import styles from "./ChatError.module.css";

const ChatError = ({ onRetry }) => {
  return (
    <div className={styles.errorContainer}>
      {/* Error Icon */}
      <div className={styles.iconWrapper}>
        <AlertCircle size={16} className={styles.icon} />
      </div>

      <div className={styles.contentWrapper}>
        {/* Error Message */}
        <div className={styles.messageBubble}>
          <p>I encountered an error processing your request.</p>
        </div>

        {/* Retry Action */}
        {onRetry && (
          <button
            onClick={onRetry}
            className={styles.retryButton}
            aria-label="Retry response"
          >
            <RefreshCw size={12} className={styles.refreshIcon} />
            <span>Regenerate response</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatError;
