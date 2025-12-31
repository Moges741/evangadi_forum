import { useEffect } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import ChatHeader from "../../components/Chatbot/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chatbot/ChatInput/ChatInput";
import ChatMessages from "../../components/Chatbot/ChatMessages/ChatMessages";
import ChatError from "../../components/Chatbot/ChatError/ChatError";
import TypingIndicator from "../../components/Chatbot/TypingIndicator/TypingIndicator";

function ChatBot() {
  const { sendMessage, messages } = useChatbot();
  // console.log(messages)
  // useEffect(() => {
  //   sendMessage("what is tailwind").then((res) => console.log(res));
  // }, []); 

  return (
    <div>
      <ChatHeader isBotTyping={true} />
      <ChatMessages messages={messages} />
      <ChatError onRetry={() => {}} />
      <TypingIndicator />
      <ChatInput />
    </div>
  );
}

export default ChatBot;
