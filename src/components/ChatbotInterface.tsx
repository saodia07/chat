"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Eye, Package, Truck, CreditCard, HelpCircle, RotateCcw } from "lucide-react";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "product" | "quick-replies";
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
  const [lastQuestion, setLastQuestion] = useState("");
  const [conversationContext, setConversationContext] = useState("");
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

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);
    
    // 현재 질문을 저장
    setLastQuestion(text);
    
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const finalMessages = [...newMessages, botResponse];
      setMessages(finalMessages);
      setIsTyping(false);
    }, 300 + Math.random() * 400);
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
    setLastQuestion("");
    setConversationContext("");
  };

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    // 이전 질문과 현재 입력을 고려한 컨텍스트 설정
    let context = "";
    if (lastQuestion && lastQuestion !== userInput) {
      context = `이전 질문: ${lastQuestion}, 현재 질문: ${userInput}`;
      setConversationContext(context);
    }
    
    // 렌즈 관련 질문 처리
    if (input.includes("렌즈") || input.includes("추천")) {
      if (input.includes("근시") || input.includes("원시")) {
        return {
          id: Date.now().toString(),
          text: "근시/원시용 렌즈를 추천해드릴게요. 어떤 브랜드를 선호하시나요? (예: 알콘, 존슨앤존슨, 바슈롬)",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      if (input.includes("다초점")) {
        return {
          id: Date.now().toString(),
          text: "다초점 렌즈는 노안이 있으신 분들에게 추천합니다. 나이대와 사용 목적을 알려주시면 더 구체적으로 추천해드릴게요.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      if (input.includes("색변") || input.includes("변색")) {
        return {
          id: Date.now().toString(),
          text: "색변 렌즈는 자외선에 반응하여 색이 변하는 렌즈입니다. 실외 활동이 많으시다면 추천합니다. 어떤 색상을 선호하시나요?",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      if (input.includes("블루라이트") || input.includes("블루")) {
        return {
          id: Date.now().toString(),
          text: "블루라이트 차단 렌즈는 디지털 기기 사용이 많으신 분들에게 추천합니다. 하루 평균 몇 시간 정도 컴퓨터를 사용하시나요?",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      if (input.includes("드라이") || input.includes("건조")) {
        return {
          id: Date.now().toString(),
          text: "드라이아이용 렌즈는 눈이 건조하신 분들에게 추천합니다. 하루 평균 렌즈 착용 시간은 얼마나 되시나요?",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      
      return {
        id: Date.now().toString(),
        text: "어떤 용도로 렌즈를 찾고 계신가요?",
        sender: "bot",
        timestamp: new Date(),
        type: "quick-replies",
        data: {
          options: [
            "근시/원시용",
            "다초점 렌즈",
            "색변 렌즈",
            "블루라이트 차단",
            "드라이아이용",
          ],
        },
      };
    }
    
    // 배송 관련 질문 처리
    if (input.includes("배송") || input.includes("택배")) {
      if (input.includes("언제") || input.includes("몇일")) {
        return {
          id: Date.now().toString(),
          text: "일반적으로 주문 후 1-2일 내에 배송되며, 배송지는 주문 시 입력하신 주소로 발송됩니다. 주문번호를 알려주시면 정확한 배송 상태를 확인해드릴게요.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      if (input.includes("비용") || input.includes("요금")) {
        return {
          id: Date.now().toString(),
          text: "배송비는 주문 금액에 따라 다릅니다. 3만원 이상 주문 시 무료배송, 3만원 미만 시 2,500원의 배송비가 발생합니다.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      
      return {
        id: Date.now().toString(),
        text: "주문하신 상품의 배송 상태를 확인해드릴게요. 주문번호를 알려주시거나, 로그인 후 주문내역에서 확인하실 수 있습니다.",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
    }
    
    // 반품/교환 관련 질문 처리
    if (input.includes("반품") || input.includes("교환")) {
      if (input.includes("기간") || input.includes("언제까지")) {
        return {
          id: Date.now().toString(),
          text: "반품/교환은 상품 수령 후 7일 이내에 가능합니다. 단, 상품이 미사용 상태여야 하며, 포장이 완전해야 합니다.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      if (input.includes("비용") || input.includes("요금")) {
        return {
          id: Date.now().toString(),
          text: "단순 변심의 경우 반품 배송비는 고객 부담이며, 제품 하자의 경우 무료로 처리됩니다. 반품 사유를 알려주시면 정확한 안내를 드릴게요.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      
      return {
        id: Date.now().toString(),
        text: "반품/교환은 상품 수령 후 7일 이내에 가능합니다. 상품이 미사용 상태여야 하며, 교환은 동일 상품으로만 가능합니다.",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
    }
    
    // 결제 관련 질문 처리
    if (input.includes("결제") || input.includes("카드")) {
      if (input.includes("할부") || input.includes("분할")) {
        return {
          id: Date.now().toString(),
          text: "신용카드로 결제 시 3개월, 6개월, 12개월 할부가 가능합니다. 할부 수수료는 카드사 정책에 따라 다를 수 있습니다.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      if (input.includes("안전") || input.includes("보안")) {
        return {
          id: Date.now().toString(),
          text: "모든 결제는 SSL 암호화로 보안이 적용되며, 개인정보는 안전하게 보호됩니다. 결제 정보는 결제 완료 후 즉시 삭제됩니다.",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
      
      return {
        id: Date.now().toString(),
        text: "신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등 다양한 결제 방법을 지원합니다.",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
    }

    // 이전 질문과 관련된 답변인지 확인
    if (lastQuestion && lastQuestion !== userInput) {
      if (lastQuestion.includes("렌즈") && (input.includes("아니") || input.includes("다른") || input.includes("그만"))) {
        return {
          id: Date.now().toString(),
          text: "다른 도움이 필요하시면 언제든 말씀해 주세요. 배송 문의, 반품/교환, 결제 문의 등 어떤 것이든 편하게 물어보세요!",
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
      }
    }

    return {
      id: Date.now().toString(),
      text: "죄송합니다. 더 구체적으로 말씀해 주시면 더 정확한 답변을 드릴 수 있습니다. 렌즈 추천, 배송 문의, 반품/교환 등 어떤 것이든 편하게 물어보세요!",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    };
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage(text);
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