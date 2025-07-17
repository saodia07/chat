"use client";

import { Message } from "./ChatbotInterface";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div className={`px-4 py-2 rounded-lg ${isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}>
            <p className="text-sm">{message.text}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {message.timestamp instanceof Date
              ? message.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
              : message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
} 