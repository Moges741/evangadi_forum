import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../Api/axiosConfig.js";
import popSound from "../assets/sounds/pop.mp3";
import notificationSound from "../assets/sounds/notification.mp3";

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyLoadingError, setHistoryLoadingError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await axios.get("/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data.history);
      } catch (err) {
        console.error("Could not load history", err.message);
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setHistoryLoadingError(errorMessage);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  // Use a ref to track the latest controller for cleanup
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (prompt) => {
    // >==> Cancel any previous pending requests if the user sends a new one rapidly
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const messageId = Date.now();
    const token = localStorage.getItem("token");

    // Obtimstic update
    setMessages((prev) => [
      ...prev,
      { id: messageId, human: prompt, model: "" },
    ]);
    setIsBotTyping(true);
    setError("");

    // Play sound with a catch block to prevent "Autoplay" browser errors
    try {
      popAudio.play().catch((err) => {
        console.log("Audio play failed:", err.message);
      });
    } catch (err) {
      console.log("Audio initialization failed:", err.message);
    }

    try {
      const { data } = await axios.post(
        "/chat",
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal, // Connect the abort signal
        }
      );

      try {
        notificationAudio.play().catch((err) => {
          console.log("Notification audio play failed:", err.message);
        });
      } catch (err) {
        console.log("Notification audio initialization failed:", err.message);
      }

      // Success: Find the message by its unique ID and update the bot response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, model: data.answer } : msg
        )
      );
    } catch (err) {
      // Don't set error state if the request was intentionally cancelled
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
        return;
      }

      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsBotTyping(false);
    }
  }, []);

  const retryLastMessage = useCallback(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const lastPrompt = lastMsg.human;

    // Remove the failed message from state before retrying
    setMessages((prev) => prev.slice(0, -1));
    sendMessage(lastPrompt);
  }, [messages, sendMessage]);

  // Cleanup: Cancel pending requests if the component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoadingHistory,
    isBotTyping,
    historyLoadingError,
    error,
    sendMessage,
    retryLastMessage,
  };
};
