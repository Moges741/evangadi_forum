import { useEffect } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import ChatHeader from "../../components/Chatbot/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chatbot/ChatInput/ChatInput";

function ChatBot() {
  // const { sendMessage, messages } = useChatbot();
  // console.log(messages)
  // useEffect(() => {
  //   sendMessage("what is tailwind").then((res) => console.log(res));
  // }, []); 

  return <div>
    <ChatHeader isBotTyping={true} />
    <ChatInput />
  </div>;
}

export default ChatBot;
