import React from 'react'
import { Input } from './ui/input'
import { Mic, Send, Mail, Calendar, SquareCheckBig, FileText, UsersRound, Clock } from 'lucide-react';
import { Button } from './ui/button';
import ActionCard from './ActionCard';

const ChatInterface = ({ className='' }) => {
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className=" w-full h-[63vh]"></div>
      <div className="flex flex-col items-start px-[10vw] w-full h-[17.5vh] border border-gray-200 pt-2">
        <h3 className="text-gray-600 text-md font-semibold">Quick Actions</h3>
        <div className="flex flex-row">
          <ActionCard icon={<Mail className="text-gray-900" size={16} />} text="Summarize my emails" className="border-blue-200 bg-blue-50 hover:bg-blue-100" />
          <ActionCard icon={<Calendar className="text-gray-900" size={16} />} text="Schedule a Meeting" className="border-green-200 bg-green-50 hover:bg-green-100" />
          <ActionCard icon={<SquareCheckBig className="text-gray-900" size={16} />} text="Log a Task" className="border-violet-200 bg-violet-50 hover:bg-violet-100" />
          <ActionCard icon={<FileText className="text-gray-900" size={16} />} text="Create Notes" className="border-orange-200 bg-orange-50 hover:bg-orange-100" />
          <ActionCard icon={<UsersRound className="text-gray-900" size={16} />} text="Team Update" className="border-sky-200 bg-sky-50 hover:bg-sky-100" />
          <ActionCard icon={<Clock className="text-gray-900" size={16} />} text="Check Schedule" className="border-purple-200 bg-purple-50 hover:bg-purple-100" />
        </div>
      </div>
      <div className="flex flex-row items-center px-[10vw] w-full h-[11vh]">
        <div className="relative">
          <Input type="text" placeholder="Type your message or ask me anything ..." className="bg-white border border-gray-200 rounded-md w-[50vw] h-[3rem] pl-10 pr-4" />
          <Mic className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-900 group-focus-within:text-black transition-colors duration-200 w-4 h-4" />
        </div>
        <Button type="button" className="ml-4 h-[3rem] w-[5rem]">
          <Send />
        </Button>
      </div>
    </div>
  )
}

export default ChatInterface