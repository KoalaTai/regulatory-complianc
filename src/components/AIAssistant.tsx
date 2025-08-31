import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Brain, Send, Mic, MicOff, User, Bot, Copy, ThumbsUp, ThumbsDown } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  context?: string
  citations?: string[]
}

export function AIAssistant() {
  const [messages, setMessages] = useKV<Message[]>('ai-chat-history', [])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample conversation starters
  const conversationStarters = [
    "What are the key requirements for FDA 510(k) submissions?",
    "Explain ISO 13485 design controls requirements",
    "How do I prepare for an FDA audit?",
    "What's the difference between EU MDR and FDA QSR?",
    "Help me understand risk management for medical devices"
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Use spark.llm for AI response
      const prompt = spark.llmPrompt`You are a regulatory compliance expert specializing in medical devices and FDA/ISO standards. 
      Provide accurate, helpful guidance for this question: ${inputMessage}
      
      Keep responses concise but comprehensive. Include relevant standard citations when applicable.`
      
      const response = await spark.llm(prompt)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        context: 'regulatory_guidance'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStarterClick = (starter: string) => {
    setInputMessage(starter)
    inputRef.current?.focus()
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>AI Regulatory Assistant</CardTitle>
              <CardDescription>Get instant guidance on compliance requirements and regulatory standards</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto">
                      <Brain className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Welcome to your AI Regulatory Assistant</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      I'm here to help you navigate complex regulatory requirements. Ask me about FDA, ISO, EU MDR, or any compliance topic.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-center">Try asking:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {conversationStarters.map((starter, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left h-auto p-3 justify-start"
                          onClick={() => handleStarterClick(starter)}
                        >
                          {starter}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'assistant' && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] space-y-2 ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground ml-auto' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.type === 'assistant' && (
                            <>
                              <Separator orientation="vertical" className="h-3" />
                              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => copyToClipboard(message.content)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {message.type === 'user' && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                          <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about regulatory requirements, standards, or compliance topics..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setIsListening(!isListening)}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}