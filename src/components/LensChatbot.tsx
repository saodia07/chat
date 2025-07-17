"use client";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function LensChatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [buttons, setButtons] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // lens-gpt 호출 함수
  const askLensGPT = async (msg: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("lens-gpt", {
      body: { message: msg }
    });
    setLoading(false);

    // 응답이 배열인지 확인, 아니면 배열 추출
    let arr: string[] = [];
    if (Array.isArray(data)) {
      arr = data;
    } else if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) arr = parsed;
      } catch {
        // 혹시라도 배열이 아닌 경우, 텍스트에서 배열 추출(예: 정규식)
        const match = data.match(/\[([^\]]+)\]/);
        if (match) {
          arr = match[1].split(",").map(s => s.replace(/[\'\"\[\]]/g, "").trim());
        }
      }
    }
    setButtons(arr);
    setMessages(prev => [...prev, msg]);
  };

  // 버튼 클릭 시
  const handleButtonClick = (text: string) => {
    askLensGPT(text);
  };

  // 입력 전송 시
  const handleSend = () => {
    if (input.trim()) {
      askLensGPT(input.trim());
      setInput("");
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>렌즈 상담 챗봇</h2>
      <div style={{ minHeight: 80, marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "8px 0", color: i % 2 === 0 ? "#333" : "#0070f3" }}>{msg}</div>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        {buttons.map((btn, i) => (
          <button key={i} onClick={() => handleButtonClick(btn)} style={{ margin: 4, padding: "8px 16px", borderRadius: 8, border: "1px solid #0070f3", background: "#f0f8ff", color: "#0070f3", cursor: "pointer" }}>
            {btn}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{ padding: "8px 16px", borderRadius: 8, background: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}>
          {loading ? "전송중..." : "전송"}
        </button>
      </div>
    </div>
  );
} 