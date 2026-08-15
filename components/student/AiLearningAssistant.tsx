"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Trash2,
  Bot,
  Brain,
  AlertCircle,
  HelpCircle,
  Code,
  BookOpen,
  ArrowRight,
} from "lucide-react"

interface Message {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: number
}

const SUGGESTED_QUESTIONS = [
  "Explain Python loops",
  "What is machine learning?",
  "Explain DBMS normalization",
  "Help me with my coding doubt",
]

export function AiLearningAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputQuery, setInputQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, isLoading])

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          if (transcript) {
            setInputQuery(transcript)
          }
          setIsListening(false)
        }

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition error:", err)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.warn("Speech recognition start failed", err)
        setIsListening(false)
      }
    }
  }

  const handleSendQuestion = async (queryText?: string) => {
    const textToSend = queryText || inputQuery
    if (!textToSend || !textToSend.trim() || isLoading) return

    const trimmed = textToSend.trim()
    setErrorMessage(null)
    setInputQuery("")

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: Date.now(),
    }

    const updatedHistory = [...messages, userMessage]
    setMessages(updatedHistory)
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Sorry, I couldn't process that question. Please try again."
        )
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.response || "No response received.",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err: any) {
      console.error("AI Assistant query error:", err)
      setErrorMessage(
        "Sorry, I couldn't process that question. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setErrorMessage(null)
  }

  // Renders simple markdown formatting safely (code blocks, bold, linebreaks)
  const renderFormattedText = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        })
      }
      parts.push({
        type: "code",
        lang: match[1] || "code",
        content: match[2],
      })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) })
    }

    return (
      <div className="space-y-2 leading-relaxed">
        {parts.map((part, pIdx) => {
          if (part.type === "code") {
            return (
              <div key={pIdx} className="my-2.5 rounded-xl bg-slate-900 p-3.5 font-mono text-[12.5px] text-slate-100 overflow-x-auto shadow-inner border border-slate-800">
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2 border-b border-slate-800 pb-1 uppercase tracking-widest font-sans font-semibold">
                  <span>{part.lang}</span>
                  <Code className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <pre className="whitespace-pre overflow-x-auto">{part.content}</pre>
              </div>
            )
          }

          // Format bold text and headers in standard text parts
          const lines = part.content.split("\n")
          return (
            <div key={pIdx} className="space-y-1">
              {lines.map((line, lIdx) => {
                if (line.startsWith("### ")) {
                  return (
                    <h4 key={lIdx} className="text-[14px] font-bold text-slate-900 mt-2 mb-1">
                      {line.replace("### ", "")}
                    </h4>
                  )
                }
                if (line.startsWith("#### ")) {
                  return (
                    <h5 key={lIdx} className="text-[13px] font-semibold text-slate-800 mt-1.5 mb-1">
                      {line.replace("#### ", "")}
                    </h5>
                  )
                }

                // Render inline bold text (**text**)
                const boldRegex = /\*\*([^*]+)\*\*/g
                const subParts = line.split(boldRegex)

                return (
                  <p key={lIdx} className={line.trim() === "" ? "h-2" : ""}>
                    {subParts.map((sub, sIdx) => {
                      if (sIdx % 2 === 1) {
                        return <strong key={sIdx} className="font-bold text-slate-900">{sub}</strong>
                      }
                      return sub
                    })}
                  </p>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card className="w-full relative z-10 rounded-[1.5rem] shadow-xs border border-[#E2E8F0] bg-white overflow-hidden font-sans transition-all">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 w-full border-b border-[#E2E8F0] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="bg-[#EFF6FF] p-2.5 rounded-2xl text-[#4F46E5] shrink-0 shadow-2xs border border-[#4F46E5]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight">
                  AI Learning Assistant
                </h3>
                <span className="bg-[#EFF6FF] text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#4F46E5]/20 uppercase tracking-wider">
                  24/7 Tutor
                </span>
              </div>
              <p className="text-[12.5px] font-medium text-[#64748B]">
                Have a doubt? Ask me anything about your studies.
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              title="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>

        {/* Chat History Window */}
        {messages.length > 0 && (
          <div className="max-h-[350px] overflow-y-auto space-y-3.5 pr-1.5 hidden-scrollbar py-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end gap-2 max-w-[90%] sm:max-w-[85%]">
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0 mb-1 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-[13.5px] font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#0F172A] text-white rounded-tr-none shadow-sm"
                        : "bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-tl-none shadow-2xs"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      renderFormattedText(msg.text)
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mt-1 px-1">
                  {msg.sender === "user" ? "You" : "AI Assistant"}
                </span>
              </div>
            ))}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#EFF6FF] border border-[#4F46E5]/20 text-[#4F46E5] text-[13px] font-semibold flex items-center gap-2 rounded-tl-none">
                  <div className="w-2 h-2 rounded-full bg-[#4F46E5] animate-ping" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-[13px] text-[#EF4444] font-medium flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-[#EF4444] text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Controls */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                value={inputQuery}
                disabled={isLoading}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendQuestion()
                  }
                }}
                placeholder="Ask your doubt..."
                className="w-full border border-[#CBD5E1] rounded-2xl pl-4 pr-10 py-3 bg-[#F8FAFC] text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none hover:bg-white hover:border-[#4F46E5] focus-visible:border-[#4F46E5] focus-visible:ring-2 focus-visible:ring-[#4F46E5]/20 transition-all disabled:opacity-50 h-11"
              />
              {/* Optional Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleMic}
                disabled={isLoading}
                title={isListening ? "Listening... Click to stop" : "Voice Input"}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all ${
                  isListening
                    ? "bg-[#EF4444] text-white animate-pulse"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <Button
              onClick={() => handleSendQuestion()}
              disabled={isLoading || !inputQuery.trim()}
              className={`${
                inputQuery.trim() && !isLoading
                  ? "bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-sm"
                  : "bg-slate-100 text-slate-400"
              } h-11 px-4 sm:px-5 rounded-2xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Ask AI</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Suggested Question Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#64748B] mr-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#4F46E5]" /> Suggested:
            </span>
            {SUGGESTED_QUESTIONS.map((chipText, cIdx) => (
              <button
                key={cIdx}
                disabled={isLoading}
                onClick={() => handleSendQuestion(chipText)}
                className="px-3 py-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[11.5px] font-semibold text-[#475569] hover:bg-[#EFF6FF] hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all active:scale-95 disabled:opacity-50 text-left"
              >
                {chipText}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
