import { Brain, Zap } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "dark"
  showIcon?: boolean
  className?: string
}

export default function Logo({ size = "md", variant = "default", showIcon = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  }

  const variantClasses = {
    default: "text-slate-900",
    white: "text-white",
    dark: "text-slate-100",
  }

  const iconVariantClasses = {
    default: "text-blue-600",
    white: "text-blue-300",
    dark: "text-blue-400",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <div className="relative">
          <div className={`${iconSizes[size]} ${iconVariantClasses[variant]} relative`}>
            <Brain className="absolute inset-0" />
            <Zap className={`absolute inset-0 ${iconVariantClasses[variant]} opacity-60`} />
          </div>
        </div>
      )}
      <div className={`font-bold tracking-tight ml-[-0.8rem] ${sizeClasses[size]} ${variantClasses[variant]}`}>
        <span className="text-[#000] dark:text-[#fff]">Loh</span>
        <span className="text-blue-600 dark:text-blue-400">.ai</span>
      </div>
    </div>
  )
}
