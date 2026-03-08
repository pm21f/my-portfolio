"use client"

import { motion } from "framer-motion"
import { FileCode2, Copy, Check } from "lucide-react"
import { useState } from "react"

const yamlConfig = `version: "3.8"

services:
  infrastructure:
    image: piyush/cloud-engineer:latest
    container_name: core-skills
    environment:
      - PRIMARY_CLOUD=AWS
      - IAC_TOOL=Terraform
      - ORCHESTRATION=Kubernetes
    networks:
      - devops-net

  backend_services:
    build:
      context: ./languages
    depends_on:
      - infrastructure
    ports:
      - "8080:8080"
    volumes:
      - golang_ecosystem:/app/go
      - ci_cd_pipelines:/app/deploy
    labels:
      - "framework.go=Gin,Echo,GORM"
      - "focus=microservices"

  databases_and_storage:
    image: managed-services:latest
    deploy:
      replicas: 3
    configs:
      - source: relational_db
        target: PostgreSQL
      - source: nosql_db
        target: DynamoDB
      - source: object_store
        target: AWS S3

networks:
  devops-net:
    driver: bridge
    security:
      - IAM_Policies
      - VPC_Peering
      - Security_Groups`

export default function Skills() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yamlConfig)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Section Header - Fixed for High Contrast in Dark Mode */}
        <div className="flex items-center mb-10 font-mono text-xl md:text-2xl border-b border-slate-200 dark:border-slate-800 pb-4">
          <FileCode2 className="mr-3 text-[var(--sky-blue)]" />
          <span className="text-[var(--term-green)] mr-2">$</span> 
          <span className="text-slate-900 dark:text-white font-bold">cat infrastructure.yaml</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* YAML Editor View */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl"
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
              <div className="text-slate-400 text-xs font-mono">infrastructure.yaml</div>
              <button onClick={copyToClipboard} className="text-slate-400 hover:text-white transition-colors">
                {copied ? <Check className="w-4 h-4 text-[var(--term-green)]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Syntax Highlighted Code */}
            <div className="p-4 md:p-6 overflow-x-auto text-sm font-mono leading-relaxed">
              <pre>
                <code className="language-yaml">
                  <span className="text-[#569cd6]">version:</span> <span className="text-[#ce9178]">"3.8"</span>{"\n\n"}
                  <span className="text-[#569cd6]">services:</span>{"\n"}
                  {"  "}<span className="text-[#4ec9b0]">infrastructure:</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">image:</span> <span className="text-[#ce9178]">piyush/cloud-engineer:latest</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">environment:</span>{"\n"}
                  {"      - "}<span className="text-[#dcdcaa]">PRIMARY_CLOUD</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">AWS</span>{"\n"}
                  {"      - "}<span className="text-[#dcdcaa]">IAC_TOOL</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">Terraform</span>{"\n"}
                  {"      - "}<span className="text-[#dcdcaa]">ORCHESTRATION</span><span className="text-[#d4d4d4]">=</span><span className="text-[#ce9178]">Kubernetes, Docker</span>{"\n\n"}
                  {"  "}<span className="text-[#4ec9b0]">backend_services:</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">depends_on:</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">infrastructure</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">volumes:</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">golang_ecosystem:/app/go</span> <span className="text-[#6a9955]"># Goroutines, Gin, GORM</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">ci_cd_pipelines:/app/deploy</span>{"\n\n"}
                  {"  "}<span className="text-[#4ec9b0]">databases_and_storage:</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">configs:</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">PostgreSQL</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">DynamoDB</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">AWS S3</span>{"\n\n"}
                  <span className="text-[#569cd6]">networks:</span>{"\n"}
                  {"  "}<span className="text-[#4ec9b0]">devops-net:</span>{"\n"}
                  {"    "}<span className="text-[#9cdcfe]">security:</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">IAM_Policies</span>{"\n"}
                  {"      - "}<span className="text-[#ce9178]">VPC, EC2, Lambda</span>
                </code>
              </pre>
            </div>
          </motion.div>

          {/* Architecture/Stack Highlight Cards - Fixed for Enterprise Theme */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-[var(--aws-amber)]/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center font-mono">
                <span className="text-[var(--aws-amber)] mr-3">☁️</span> AWS Cloud Architecture
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Expertise in designing secure VPC networks, deploying serverless functions (Lambda), managing scalable compute (EC2), and implementing robust IAM policies.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-[var(--tf-purple)]/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center font-mono">
                <span className="text-[var(--tf-purple)] mr-3">🏗️</span> Infrastructure as Code
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Utilizing Terraform to automate and manage infrastructure state, coupled with Docker and Kubernetes for container orchestration and reliable CI/CD delivery.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-[var(--sky-blue)]/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center font-mono">
                <span className="text-[var(--sky-blue)] mr-3">⚙️</span> Cloud-Native Backends
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Building high-performance, concurrent backend systems leveraging Golang (Goroutines, Gin, GORM), optimized for microservices and scalable cloud deployments.
              </p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}