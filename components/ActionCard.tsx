import React, { ReactNode } from 'react'

interface ActionCardProps {
  icon?: ReactNode;
  text?: string;
  className?: string;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, text = '', className = '', onClick }) => {
  return (
    <div 
      className={`w-[9rem] h-[4rem] px-[0.7rem] py-[0.5rem] border rounded-sm flex flex-col items-center justify-center mx-[2.5px] transition-all duration-200 hover:shadow-sm ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label={onClick ? `Action: ${text}` : undefined}
    >
      {icon && (
        <div className="flex items-center justify-center mb-1">
          {icon}
        </div>
      )}
      {text && (
        <p className="text-gray-900 text-[11px] font-semibold text-center leading-tight">
          {text}
        </p>
      )}
    </div>
  )
}

export default ActionCard