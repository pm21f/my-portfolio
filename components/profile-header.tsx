"use client"

import { Github, Linkedin, Mail, MapPin, Download, Twitter, Instagram } from "lucide-react"

export default function ProfileHeader() {
  return (
    <div className="w-full bg-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm border border-border/50 relative overflow-hidden">
      
      {/* Optional: The geometric background accent from the screenshot */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-br-full -z-10 blur-2xl"></div>

      {/* Profile Image */}
      <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-background shadow-lg">
        <img 
          src="/placeholder.svg?height=128&width=128" 
          alt="Piyush Modgil" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Info */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white mb-1">
          Piyush <span className="text-gray-400 font-normal">Modgil</span>
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          Cloud Engineer | DevOps | Go Developer
        </p>
        
        {/* Social Icons */}
        <div className="flex justify-center md:justify-start gap-4 text-gray-400">
          <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
          <a href="#" className="hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
          <a href="https://linkedin.com/in/piyushmodgil" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
          <a href="https://github.com" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
        </div>
      </div>

      {/* Contact & Meta Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8 text-sm">
        
        {/* Email */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</p>
          <a href="mailto:piyushmodgil9@gmail.com" className="text-gray-200 hover:text-blue-400 flex items-center gap-2">
            piyushmodgil9@gmail.com <Mail className="w-3 h-3" />
          </a>
        </div>

        {/* CV Download */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">CV</p>
          <a href="https://docs.google.com/document/d/1545j_wmPT3haYTkodSCo9D1whmn2WOkЗ/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-blue-400 flex items-center gap-2">
            Download <Download className="w-3 h-3" />
          </a>
        </div>

        {/* Location */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Location</p>
          <p className="text-gray-200 flex items-center gap-2">
            Una, HP, India <MapPin className="w-3 h-3 text-gray-400" />
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Status</p>
          <p className="text-gray-200 flex items-center gap-2">
            Available 🚀
          </p>
        </div>

      </div>
    </div>
  )
}