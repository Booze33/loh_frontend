import { AIStatusStore } from '@/types'
import { create } from 'zustand'

export type AIStatus = 'idle' | 'listening' | 'thinking' | 'responding'

const statusMessages: Record<AIStatus, string> = {
  idle: '',
  listening: 'Listening…',
  thinking: 'Thinking…',
  responding: 'Responding…'
}

export const useAIStatusStore = create<AIStatusStore>((set) => ({
  status: 'idle',
  message: '',
  
  setStatus: (status: AIStatus) => 
    set({ 
      status, 
      message: statusMessages[status] 
    }),
  
  setListening: () => 
    set({ 
      status: 'listening', 
      message: statusMessages.listening 
    }),
  
  setThinking: () => 
    set({ 
      status: 'thinking', 
      message: statusMessages.thinking 
    }),
  
  setResponding: () => 
    set({ 
      status: 'responding', 
      message: statusMessages.responding 
    }),
  
  setIdle: () => 
    set({ 
      status: 'idle', 
      message: statusMessages.idle 
    })
}))

export const useAIStatus = () => {
  const { status, message } = useAIStatusStore()
  
  return {
    status,
    message,
    isIdle: status === 'idle',
    isListening: status === 'listening',
    isThinking: status === 'thinking',
    isResponding: status === 'responding',
    isActive: status !== 'idle'
  }
}