'use client';

import ChatInterface from "@/components/chatInterface";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { id } = useParams();

  return (
    <div className="w-[100vw] h-[95vh] mt-[4rem] flex flex-row">
      <div className="flex items-center justify-between">
        <ChatInterface className="w-[78vw] h-full" chatId={id} />
      </div>
    </div>
  );
}
