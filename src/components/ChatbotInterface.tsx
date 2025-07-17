"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Eye, Package, Truck, CreditCard, HelpCircle, RotateCcw } from "lucide-react";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import { supabase } from "../utils/supabaseClient";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "quick-replies";
  data?: any;
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 👓 아이아이 AI 상담사입니다. 무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: "렌즈 추천받기", icon: Eye },
    { text: "배송 문의", icon: Truck },
    { text: "반품/교환", icon: Package },
    { text: "결제 문의", icon: CreditCard },
    { text: "기타 문의", icon: HelpCircle },
  ];

  // lens-gpt 호출 함수
  const askLensGPT = async (msg: string) => {
    setIsTyping(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      text: msg,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    const { data, error } = await supabase.functions.invoke("lens-gpt", {
      body: { message: msg }
    });

    // 응답이 배열인지 확인, 아니면 배열 추출
    let arr: string[] = [];
    if (Array.isArray(data)) {
      arr = data;
    } else if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) arr = parsed;
      } catch {
        // 배열 형태의 문자열에서 항목 추출 (따옴표로 감싼 항목)
        const matches = data.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
        if (matches) {
          arr = matches.map(s => s.replace(/^["'\[\]\{\}\(\)\s]+|["'\[\]\{\}\(\)\s]+$/g, ""));
        }
      }
    }

    // 버튼에서 괄호, 따옴표, 공백 모두 제거, 빈 문자열 제외
    const filteredArr = arr
      .map(t => t.trim().replace(/^["'\[\]\{\}\(\)\s]+|["'\[\]\{\}\(\)\s]+$/g, ""))
      .filter(t => t.length > 0);

    if (filteredArr.length > 0) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "아래에서 선택하거나 추가 질문을 입력해 주세요!",
          sender: "bot",
          timestamp: new Date(),
          type: "quick-replies",
          data: { options: filteredArr },
        },
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: typeof data === "string" ? data : "답변을 이해하지 못했습니다.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ]);
    }
    setIsTyping(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    await askLensGPT(text);
  };

  const handleReset = () => {
    const initialMessage: Message = {
      id: "1",
      text: "안녕하세요! 👓 아이아이 AI 상담사입니다. 무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    };
    setMessages([initialMessage]);
    setInputText("");
  };

  const handleQuickReply = (text: string) => {
    askLensGPT(text);
  };

  const canReset = messages.length > 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">아이아이 AI 상담</h2>
                <p className="text-blue-100 text-sm">실시간 상담 가능</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {canReset && (
                <button
                  onClick={handleReset}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="처음부터 다시 시작"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <span className="text-sm text-gray-500">답변을 작성 중입니다...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <QuickReplies replies={quickReplies} onReply={handleQuickReply} />
          </div>
        )}
        {/* 동적 퀵리플라이 */}
        {messages[messages.length - 1]?.type === "quick-replies" && messages[messages.length - 1]?.data?.options && (
          <div className="px-6 pb-4">
            <QuickReplies replies={messages[messages.length - 1].data.options.map((t: string) => ({ text: t }))} onReply={handleQuickReply} />
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 