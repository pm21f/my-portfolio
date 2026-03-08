"use client"

import { User, FileText, Box, BookOpen, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "about", label: "ABOUT", icon: User },
    { id: "resume", label: "RESUME", icon: FileText },
    { id: "portfolio", label: "PORTFOLIO", icon: Box },
    { id: "blog", label: "BLOG", icon: BookOpen },
    { id: "contact", label: "CONTACT", icon: Smartphone },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:sticky md:top-8 md:w-28 md:h-[600px] bg-[#1E1E22] md:rounded-[32px] shadow-xl flex md:flex-col justify-between items-center px-4 py-3 md:py-8 border-t md:border border-border/10">
      {navItems.map((item) => {
        const isActive = activeTab === item.id
        const Icon = item.icon

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl transition-all duration-300 gap-1",
              isActive 
                ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105" 
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            )}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] md:text-[10px] font-bold tracking-wider mt-1">
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}