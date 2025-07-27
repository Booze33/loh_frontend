// In your component
import { useAIStatusStore, useAIStatus } from './store/aiStatusStore'

function ChatInterface() {
  const { setListening, setThinking, setResponding, setIdle } = useAIStatusStore()
  const { message, isActive, isResponding } = useAIStatus()

  const handleSendMessage = async (userMessage: string) => {
    setListening() // "Listening…"
    
    // Process user input
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setThinking() // "Thinking…"
    
    // AI processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setResponding() // "Responding…"
    
    // Stream AI response
    await streamAIResponse()
    
    setIdle() // Back to idle state
  }

  return (
    <div>
      {isActive && (
        <div className="ai-status">
          {message}
        </div>
      )}
    </div>
  )
}
