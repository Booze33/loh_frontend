import React, { ReactNode } from 'react'

interface ActionCardProps {
  icon?: ReactNode;
  task?: string;
  text?: string;
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon='', text='', task='', className='' }) => {
  return (
    <div className={`w-[9rem] h-[4rem] px-[0.7rem] py-[0.5rem] border rounded-sm flex flex-col items-center justify-center mx-[2.5px] ${className}`}>
      {icon}
      <p className="text-gray-900 text-[11px] font-semibold mt-2">{text}</p>
    </div>
  )
}

export default ActionCard