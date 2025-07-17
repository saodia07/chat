import ChatbotInterface from "../components/ChatbotInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            👓 아이아이 AI 상담
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            안경과 렌즈에 대한 모든 궁금증을 해결해드립니다. <br />
            맞춤형 렌즈 추천부터 배송 문의까지, 언제든 편리하게 상담받으세요.
          </p>
        </div>
        <ChatbotInterface />
      </div>
    </main>
  );
}
