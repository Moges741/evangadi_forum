import { useRef, useEffect } from "react";
import styles from "./ChatBot.module.css";
import { useChatbot } from "../../../hooks/useChatbot";
import ChatMessages from "../ChatMessages/ChatMessages";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import ChatInput from "../ChatInput/ChatInput";
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatError from "../ChatError/ChatError";

function ChatBot({ onClose }) {
  const {
    messages,
    isBotTyping,
    isLoadingHistory,
    error,
    sendMessage,
    retryLastMessage,
  } = useChatbot();

  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBotTyping, error]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainCard}>
        {/* Pass isBotTyping to show the "Thinking" status in header */}
        <ChatHeader isBotTyping={isBotTyping} onClose={onClose} />

        <div ref={scrollRef} className={styles.chatBody}>
          {isLoadingHistory ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Restoring conversation...</p>
            </div>
          ) : (
            <>
              <ChatMessages messages={messages} />

              {/* Show error with the retry logic we built */}
              {error && <ChatError onRetry={retryLastMessage} />}

              {/* Show typing dots while waiting for API */}
              {isBotTyping && <TypingIndicator />}
            </>
          )}
        </div>

        {/* Input area handles sending and disabling itself while bot types */}
        <ChatInput onSubmit={sendMessage} isBotTyping={isBotTyping} />
      </div>
    </div>
  );
}

export default ChatBot;
