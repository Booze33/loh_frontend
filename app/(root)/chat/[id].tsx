import ChatInterface from "@/components/chatInterface";

export default function ChatPage() {
  return (
    <div className="w-[100vw] h-[95vh] mt-[4rem] flex flex-row">
      <div className="flex items-center justify-between">
        <ChatInterface className="w-[72vw] h-full" />
      </div>
    </div>
  );
}
