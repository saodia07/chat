// @deno-types="npm:@types/node"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req: Request) => {
  // CORS 헤더 설정
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { message } = await req.json();

    // OpenAI Chat API 호출
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "너는 렌즈 상담 전문가 챗봇이야. 답변은 항상 짧은 문장 여러 개로 나눠서 배열로 만들어줘." },
          { role: "user", content: message }
        ],
        max_tokens: 512,
        n: 1
      })
    });

    const openaiData = await openaiRes.json();

    // 답변을 배열로 가공 (예: 문장 단위로 쪼개기)
    let answers: string[] = [];
    if (openaiData.choices && openaiData.choices.length > 0) {
      answers = (openaiData.choices[0].message.content as string)
        .split(/\n|\. /)
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    return new Response(JSON.stringify(answers), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }
    });
  } catch (e) {
    let errorMsg = "에러가 발생했습니다.";
    if (e instanceof Error) {
      errorMsg = e.message;
    } else if (typeof e === "string") {
      errorMsg = e;
    }
    return new Response(JSON.stringify([errorMsg]), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      status: 500
    });
  }
});
