'use client';

import { Badge } from "@/components/ui/badge"
import { useAIStatus } from "@/hooks/aiStatusStore"

const Status = () => {
  const { message, isActive, status } = useAIStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'bg-blue-500'
      case 'thinking':
        return 'bg-yellow-500'
      case 'responding':
        return 'bg-green-500'
      case 'idle':
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="flex flex-row items-center justify-center ml-8">
      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor()}`} />
      <h2 className="font-semibold text-sm mr-4">AI Assistant</h2>
      {isActive && (
        <Badge variant="secondary" className="mr-16">{message}</Badge>
      )}
    </div>
  )
}

export default Status;