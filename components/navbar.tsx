"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Terminal, Menu, X, FileText } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  // Prevent hydration mismatch
  if (!mounted) return null

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-blue-600 dark:text-[var(--sky-blue)]" />
          <span className="font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            SYS_ADMIN<span className="text-slate-400 dark:text-slate-600">:</span>PIYUSH
          </span>
        </div>

        {/* DESKTOP MENU - Clean & Professional */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors
                         text-slate-600 hover:text-slate-900 hover:bg-slate-100
                         dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            >
              {item.name}
            </button>
          ))}

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Primary Call to Action: Resume */}
          <a
            href="https://docs.google.com/document/d/1545j_wmPT3haYTkodSCo9D1whmn2WOkЗ/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all
                       bg-slate-900 text-white hover:bg-slate-800 shadow-sm
                       dark:bg-[var(--sky-blue)] dark:text-slate-950 dark:hover:bg-sky-400"
          >
            <FileText className="h-4 w-4" />
            Resume
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-slate-600 dark:text-slate-400"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-900 dark:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU DROP-DOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  scrollToSection(item.href)
                  setMobileMenuOpen(false)
                }}
                className="text-left px-4 py-3 text-sm font-medium rounded-md
                           text-slate-700 hover:bg-slate-100 hover:text-slate-900
                           dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.name}
              </button>
            ))}
            <a
               href="https://docs.google.com/document/d/1545j_wmPT3haYTkodSCo9D1whmn2WOkЗ/view?usp=sharing"
               target="_blank"
               rel="noopener noreferrer"
               className="mt-4 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-md
                          bg-slate-900 text-white
                          dark:bg-[var(--sky-blue)] dark:text-slate-950"
               onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              View Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}