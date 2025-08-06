import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

const Sidebar = () => {
  return (
    <ScrollArea className="relative top-24 border-r-2 w-[28vw] h-[95vh] pt-8">
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="w-[18vw] h-[13rem] flex items-center justify-center border-2"></div>
          <div className="w-[18vw] h-[13rem] flex items-center justify-center border-2"></div>
          <div className="w-[18vw] h-[13rem] flex items-center justify-center border-2"></div>
          <div className="w-[18vw] h-[13rem] flex items-center justify-center border-2"></div>
        </div>
    </ScrollArea>
  )
}

export default Sidebar