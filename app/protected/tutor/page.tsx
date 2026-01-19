"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { BitmapChevron } from "@/components/bitmap-chevron"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/tutor/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get AI response"
      setError(errorMessage)
      console.error("[v0] Tutor error:", err)

      const errorAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorAssistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Learn</p>
        <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">AI Tutor</h1>
        <p className="font-mono text-sm text-muted-foreground mt-2">
          Ask any question and get detailed explanations tailored to your learning level.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="border border-dashed border-foreground/20 p-8 text-center">
              <p className="font-mono text-xs text-muted-foreground mb-4">
                Start a conversation with your AI tutor. Ask about any topic you want to learn.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Explain quantum entanglement", "How does photosynthesis work?", "What is machine learning?"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 border border-foreground/20 hover:border-accent hover:text-accent transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-4 border ${
                    message.role === "user" ? "border-accent/50 bg-accent/5" : "border-foreground/20 bg-secondary/50"
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    {message.role === "user" ? "You" : "AI Tutor"}
                  </p>
                  <p className="font-mono text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 border border-foreground/20 bg-secondary/50">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">AI Tutor</p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse delay-100"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200"></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="max-w-[80%] p-4 border border-red-500/50 bg-red-500/10">
                <p className="font-mono text-sm text-red-500">{error}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6 md:p-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Send
              <BitmapChevron />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
