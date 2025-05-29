// src/pages/chat/ChatbotPage.tsx

import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { useAuthStore } from "@/store/authGlobal";

export default function ChatbotPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    console.log("🔌 WebSocket 연결 시도 중...");
    console.log("📦 accessToken:", accessToken);

    const client = new Client({
      brokerURL: "ws://localhost:9800/ws/chat",
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (str) => {
        console.log("🐛 STOMP DEBUG:", str);
      },
      onConnect: () => {
        console.log("✅ STOMP 연결됨");

        client.subscribe("/user/queue/response", (message: IMessage) => {
          console.log("📩 메시지 수신됨:", message.body);
          try {
            const body = JSON.parse(message.body);
            console.log("📦 파싱된 응답:", body);
            setMessages((prev) => [...prev, `🤖 ${body.message}`]);
          } catch (e) {
            console.error("❌ JSON 파싱 실패", e);
          }
        });
      },
      onWebSocketError: (e) => {
        console.error("🛑 WebSocket 연결 오류", e);
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 프로토콜 오류", frame);
      },
      onDisconnect: () => {
        console.log("❎ STOMP 연결 종료");
      },
      reconnectDelay: 5000,
    });

    clientRef.current = client;
    client.activate();

    const interval = setInterval(() => {
      console.log("📡 연결 상태:", client.connected);
    }, 3000);

    return () => {
      console.log("🧹 클라이언트 해제");
      client.deactivate();
      clearInterval(interval);
    };
  }, [accessToken]);

  const sendMessage = () => {
    console.log("📤 sendMessage 호출됨");
    if (clientRef.current && clientRef.current.connected) {
      console.log("✅ client.connected 통과");

      const chatReq = {
        message: input,
      };

      clientRef.current.publish({
        destination: "/pub/chat",
        body: JSON.stringify(chatReq),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessages((prev) => [...prev, `🧑 ${input}`]);
      setInput("");
    } else {
      console.warn("⚠️ WebSocket 연결 안 됨. 메시지 전송 불가");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧠 챗봇 테스트</h2>
      <div className="border h-64 overflow-y-auto p-2 mb-4 bg-white">
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4"
          onClick={sendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
}
