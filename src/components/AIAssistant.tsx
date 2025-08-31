import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Brain, User, Copy, ThumbsUp, ThumbsDown, BookOpen, ExternalLink } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{
    title: string
    section: string
    url?: string
  }>
  helpful?: boolean
}

interface ConversationTopic {
  id: string
  title: string
  description: string
  icon: string
}

export function AIAssistant() {
  const [messages, setMessages] = useKV<ChatMessage[]>('ai-chat-messages', [])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const conversationStarters: ConversationTopic[] = [
    {
      id: 'design-controls',
      title: 'FDA Design Controls',
      description: 'Learn about 21 CFR 820.30 design control requirements',
      icon: '🎯'
    },
    {
      id: 'risk-management',
      title: 'ISO 14971 Risk Management',
      description: 'Understanding risk management for medical devices',
      icon: '⚡'
    },
    {
      id: 'clinical-evaluation',
      title: 'EU MDR Clinical Evaluation',
      description: 'Clinical evaluation requirements under EU MDR',
      icon: '🏥'
    },
    {
      id: 'quality-system',
      title: 'ISO 13485 QMS',
      description: 'Quality management system implementation',
      icon: '✓'
    },
    {
      id: 'validation',
      title: 'Process Validation',
      description: 'Validation requirements for medical device manufacturing',
      icon: '🔬'
    },
    {
      id: 'documentation',
      title: 'Technical Documentation',
      description: 'Creating compliant technical documentation',
      icon: '📋'
    }
  ]

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI response with regulatory knowledge
    const responses = {
      'design controls': {
        content: `Design controls under FDA 21 CFR Part 820.30 are mandatory for Class II and III medical devices. The regulation requires manufacturers to establish and maintain procedures to control the design of devices throughout the product lifecycle.

Key requirements include:

**Design Planning (820.30(b))**
- Document design and development activities
- Assign qualified personnel with defined responsibilities
- Establish design review procedures

**Design Input (820.30(c))**  
- Define device requirements including functional, performance, safety, and regulatory requirements
- Ensure inputs are appropriate and address intended use and needs of users

**Design Output (820.30(d))**
- Document design results in a form that can be evaluated
- Include or reference acceptance criteria
- Ensure outputs meet design input requirements

**Design Review (820.30(e))**
- Conduct formal design reviews at appropriate stages
- Include representatives of all functions concerned with the design stage
- Document results and any necessary actions

**Design Verification (820.30(f))**
- Confirm design outputs meet design input requirements through objective evidence

**Design Validation (820.30(g))**
- Ensure device conforms to defined user needs and intended uses under actual use conditions

**Design Transfer (820.30(h))**
- Transfer design output to production through established procedures

**Design Changes (820.30(i))**
- Control and document changes to approved designs
- Verify and validate changes as appropriate before implementation`,
        sources: [
          { title: '21 CFR Part 820.30', section: 'Design Controls', url: '/standards/fda-qsr-820' },
          { title: 'FDA Design Control Guidance', section: 'Implementation Guide', url: '/guidance/design-controls' }
        ]
      },
      'risk management': {
        content: `ISO 14971:2019 provides a framework for risk management throughout the medical device lifecycle. Risk management is a systematic application of management policies, procedures, and practices to analyze, evaluate, control, and monitor risk.

**Key Process Steps:**

**Risk Management Planning (Clause 4)**
- Establish risk management process scope
- Define risk management activities and responsibilities  
- Create risk management file for documentation

**Risk Analysis (Clause 5)**
- Identify intended use and reasonably foreseeable misuse
- Identify characteristics that could affect safety
- Identify known and foreseeable hazards and hazardous situations
- Estimate risk for each hazardous situation

**Risk Evaluation (Clause 6)**
- Compare estimated risks against risk acceptability criteria
- Document risk acceptability decisions

**Risk Control (Clause 7)**  
- Implement risk control measures using hierarchy:
  1. Safety by design (inherent safety)
  2. Protective measures in the device or manufacturing process
  3. Information for safety (warnings, training)
- Verify effectiveness of risk control measures
- Assess if new risks are introduced

**Evaluation of Overall Residual Risk (Clause 8)**
- Determine if overall residual risk is acceptable
- Consider benefit-risk analysis when applicable

**Risk Management Report (Clause 9)**
- Document that risk management process has been appropriately implemented
- Overall residual risk is acceptable
- Appropriate methods are in place for obtaining relevant production and post-production information`,
        sources: [
          { title: 'ISO 14971:2019', section: 'Risk Management for Medical Devices', url: '/standards/iso-14971' },
          { title: 'ISO/TR 24971', section: 'Guidance on ISO 14971', url: '/guidance/iso-tr-24971' }
        ]
      },
      'default': {
        content: `I can help you with regulatory compliance questions related to medical devices and other regulated industries. I have knowledge of FDA regulations, ISO standards, EU MDR, and other key regulatory frameworks.

Some areas I can assist with:
- FDA 21 CFR Part 820 (Quality System Regulation)
- ISO 13485 (Medical Device QMS)
- ISO 14971 (Risk Management)
- EU MDR 2017/745
- Clinical evaluation and validation
- Design controls and documentation
- Audit preparation and compliance strategies

Feel free to ask specific questions about any regulatory topic, and I'll provide detailed, cited responses to help ensure your compliance efforts are well-informed.`,
        sources: [
          { title: 'Regulatory Knowledge Base', section: 'Overview', url: '/knowledge-base' }
        ]
      }
    }

    // Simple keyword matching for demo
    const lowerMessage = userMessage.toLowerCase()
    let responseKey = 'default'
    
    if (lowerMessage.includes('design control') || lowerMessage.includes('820.30')) {
      responseKey = 'design controls'
    } else if (lowerMessage.includes('risk') && (lowerMessage.includes('14971') || lowerMessage.includes('management'))) {
      responseKey = 'risk management'
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: responses[responseKey as keyof typeof responses].content,
      timestamp: new Date(),
      sources: responses[responseKey as keyof typeof responses].sources
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(current => [...current, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse = await generateAIResponse(userMessage.content)
      setMessages(current => [...current, aiResponse])
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopicSelect = (topic: ConversationTopic) => {
    const topicMessage = `Tell me about ${topic.title.toLowerCase()}`
    setInputValue(topicMessage)
    setSelectedTopic(topic.id)
  }

  const markHelpful = (messageId: string, helpful: boolean) => {
    setMessages(current => 
      current.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    )
    toast.success(helpful ? 'Marked as helpful' : 'Feedback recorded')
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const clearConversation = () => {
    setMessages([])
    setSelectedTopic(null)
    toast.success('Conversation cleared')
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Compliance Assistant</h2>
          <p className="text-muted-foreground">Get instant regulatory guidance with cited sources</p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" onClick={clearConversation}>
            Clear Conversation
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversation Starters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Topics</CardTitle>
              <CardDescription>Start a conversation about common regulatory topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversationStarters.map(topic => (
                  <Button
                    key={topic.id}
                    variant={selectedTopic === topic.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTopicSelect(topic)}
                    className="w-full justify-start text-left h-auto py-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base">{topic.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{topic.title}</div>
                        <div className="text-xs text-muted-foreground">{topic.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Regulatory AI Assistant</CardTitle>
                  <CardDescription>Powered by comprehensive regulatory knowledge base</CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Welcome to AI Compliance Assistant</h3>
                      <p className="text-muted-foreground mb-4">Ask me anything about regulatory compliance, standards, or best practices.</p>
                      <div className="text-sm text-muted-foreground">
                        Try asking: "What are FDA design control requirements?" or select a quick topic.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'assistant' && (
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Brain className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                          <div className={`rounded-lg p-4 ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground ml-auto' 
                              : 'bg-muted'
                          }`}>
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </div>
                            
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                                <div className="text-xs font-medium mb-2 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  Sources:
                                </div>
                                <div className="space-y-1">
                                  {message.sources.map((source, index) => (
                                    <div key={index} className="text-xs">
                                      <Badge variant="outline" className="text-xs">
                                        {source.title} - {source.section}
                                        {source.url && (
                                          <ExternalLink className="ml-1 h-3 w-3" />
                                        )}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                            
                            {message.role === 'assistant' && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(message.content)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markHelpful(message.id, true)}
                                  className={`h-6 w-6 p-0 ${message.helpful === true ? 'text-green-600' : ''}`}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markHelpful(message.id, false)}
                                  className={`h-6 w-6 p-0 ${message.helpful === false ? 'text-red-600' : ''}`}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {message.role === 'user' && (
                          <Avatar>
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Brain className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm">Analyzing your question...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a regulatory compliance question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}