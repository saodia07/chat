"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, RotateCcw, User } from "lucide-react";
import { supabase } from "../utils/supabaseClient";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "quick-replies";
  data?: unknown;
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 👓 렌즈 상담 챗봇입니다. 궁금한 점을 선택하거나 입력해 주세요!",
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

  // lens-gpt 호출 함수 (기존 로직 유지)
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
      text: "안녕하세요! 👓 렌즈 상담 챗봇입니다. 궁금한 점을 선택하거나 입력해 주세요!",
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
    <div className="min-h-screen bg-[#f7f7fa] flex flex-col items-center py-2">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-9 h-9 text-yellow-400" />
          <span className="font-bold text-2xl text-gray-800">렌즈 상담 챗봇</span>
        </div>
        {canReset && (
          <button
            onClick={handleReset}
            className="p-3 text-gray-500 hover:text-yellow-500 rounded-full transition-colors"
            title="처음부터 다시 시작"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="w-full max-w-lg flex-1 flex flex-col bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-6 pb-4" style={{ minHeight: 400 }}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-end gap-3`}>
              {message.sender === "bot" && (
                <div className="w-12 h-12 bg-yellow-300 flex items-center justify-center rounded-full shadow text-white font-bold">
                  <MessageCircle className="w-7 h-7 text-yellow-700" />
                </div>
              )}
              <div className={`rounded-3xl px-6 py-4 shadow text-lg max-w-[80%] whitespace-pre-line leading-relaxed font-medium ${message.sender === "user" ? "bg-yellow-100 text-gray-900 rounded-br-2xl" : "bg-gray-100 text-gray-800 rounded-bl-2xl"}`}>
                {message.text}
              </div>
              {message.sender === "user" && (
                <div className="w-12 h-12 bg-gray-300 flex items-center justify-center rounded-full shadow text-white font-bold">
                  <User className="w-7 h-7 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <span className="text-lg text-gray-500 font-medium">답변을 작성 중입니다...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies (카드/버튼형) */}
        {messages[messages.length - 1]?.type === "quick-replies" && (messages[messages.length - 1]?.data as { options: string[] })?.options && (
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {(messages[messages.length - 1]?.data as { options: string[] }).options.map((t: string, i: number) => (
              <button
                key={i}
                onClick={() => handleQuickReply(t)}
                className="bg-white border-2 border-yellow-400 rounded-2xl px-6 py-3 text-yellow-700 text-lg font-bold shadow hover:bg-yellow-100 transition-all min-w-[160px]"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input (하단 고정) */}
      <div className="w-full max-w-lg mt-5 px-4 sticky bottom-0 z-10">
        <div className="flex items-center gap-3 bg-white rounded-full shadow-lg px-5 py-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 border-none bg-transparent focus:outline-none text-lg font-medium"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="px-6 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
} 