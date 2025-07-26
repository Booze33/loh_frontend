"use client"

import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  size?: number
}

export default function Loader({ className, size = 200 }: LoaderProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Filter definitions */}
      <svg className="w-0 h-0 absolute">
        <defs>
          <filter id="gegga">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10"
              result="inreGegga"
            />
            <feComposite in="SourceGraphic" in2="inreGegga" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Shadow/blur layer */}
      <svg
        className="absolute blur-sm opacity-30"
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{ transform: "translate(3px, 3px)" }}
      >
        <defs>
          <linearGradient id="shadowGradient">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient
            y2="160"
            x2="160"
            y1="40"
            x1="40"
            gradientUnits="userSpaceOnUse"
            id="shadowGradientApplied"
            href="#shadowGradient"
          />
        </defs>
        <path
          className="animate-spin-slow"
          d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64"
          fill="none"
          stroke="url(#shadowGradientApplied)"
          strokeWidth="23"
          strokeLinecap="round"
          strokeDasharray="180 800"
          style={{
            animation: "dash-slow 10s infinite linear",
          }}
        />
        <circle
          className="animate-spin-fast"
          cx="100"
          cy="100"
          r="64"
          fill="none"
          stroke="url(#shadowGradientApplied)"
          strokeWidth="23"
          strokeLinecap="round"
          strokeDasharray="26 54"
          style={{
            animation: "dash-fast 3s infinite linear",
          }}
        />
      </svg>

      {/* Main loader */}
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: "url(#gegga)" }}>
        <defs>
          <linearGradient id="mainGradient">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient
            y2="160"
            x2="160"
            y1="40"
            x1="40"
            gradientUnits="userSpaceOnUse"
            id="gradient"
            href="#mainGradient"
          />
        </defs>
        <path
          d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="23"
          strokeLinecap="round"
          strokeDasharray="180 800"
          style={{
            animation: "dash-slow 10s infinite linear",
          }}
        />
        <circle
          cx="100"
          cy="100"
          r="64"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="23"
          strokeLinecap="round"
          strokeDasharray="26 54"
          style={{
            animation: "dash-fast 3s infinite linear",
          }}
        />
      </svg>

      <style jsx>{`
        @keyframes dash-slow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -403px;
          }
        }
        
        @keyframes dash-fast {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -403px;
          }
        }
      `}</style>
    </div>
  )
}
