import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HelpCircle, X, Lightbulb, BookOpen, AlertTriangle } from '@phosphor-icons/react'

interface HelpContext {
  title: string
  content: string
  type: 'tip' | 'warning' | 'info'
  relevantTo: string[]
}

interface HelpBubbleProps {
  activeTab?: string
  contextData?: any
}

export function HelpBubble({ activeTab = 'dashboard', contextData }: HelpBubbleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentHelp, setCurrentHelp] = useState<HelpContext[]>([])

  const helpContexts: Record<string, HelpContext[]> = {
    dashboard: [
      {
        title: "Getting Started",
        content: "Welcome to VirtualBackroom.ai! Start by exploring regulatory standards or asking the AI assistant about compliance requirements.",
        type: "tip",
        relevantTo: ["new_users"]
      },
      {
        title: "Quick Actions",
        content: "Use the quick action cards to jump directly to common regulatory tasks like FDA QSR compliance or ISO 13485 guidance.",
        type: "info",
        relevantTo: ["navigation"]
      }
    ],
    standards: [
      {
        title: "Standards Search",
        content: "Use specific terms like 'design controls', 'risk management', or 'validation' to find relevant regulatory requirements quickly.",
        type: "tip",
        relevantTo: ["search"]
      },
      {
        title: "Regional Compliance",
        content: "Different standards apply to different regions. FDA QSR for US, ISO 13485 internationally, and EU MDR for European markets.",
        type: "info",
        relevantTo: ["compliance"]
      }
    ],
    assistant: [
      {
        title: "AI Expertise",
        content: "The AI assistant specializes in regulatory compliance for medical devices. Ask specific questions about requirements, processes, or interpretations.",
        type: "tip",
        relevantTo: ["ai_usage"]
      },
      {
        title: "Voice Input",
        content: "Click the microphone button to use voice input. Make sure your browser allows microphone access.",
        type: "info",
        relevantTo: ["voice"]
      },
      {
        title: "Citation Accuracy",
        content: "Always verify AI-provided regulatory citations with official sources. The AI provides guidance, not legal advice.",
        type: "warning",
        relevantTo: ["accuracy"]
      }
    ],
    audit: [
      {
        title: "Audit Preparation",
        content: "Follow the step-by-step workflow to prepare for regulatory audits. Each step includes specific requirements and checkpoints.",
        type: "tip",
        relevantTo: ["preparation"]
      },
      {
        title: "Documentation",
        content: "Ensure all required documentation is prepared and organized before marking audit steps as complete.",
        type: "warning",
        relevantTo: ["documentation"]
      }
    ],
    citations: [
      {
        title: "Citation Organization",
        content: "Use tags and categories to organize your citations. This makes them easier to find and reference in compliance documents.",
        type: "tip",
        relevantTo: ["organization"]
      },
      {
        title: "External References",
        content: "Add URLs to official regulatory sources for easy access to original documents and updates.",
        type: "info",
        relevantTo: ["references"]
      }
    ]
  }

  useEffect(() => {
    setCurrentHelp(helpContexts[activeTab] || [])
  }, [activeTab])

  const getIcon = (type: HelpContext['type']) => {
    switch (type) {
      case 'tip': return <Lightbulb className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'info': return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: HelpContext['type']) => {
    switch (type) {
      case 'tip': return 'bg-accent text-accent-foreground'
      case 'warning': return 'bg-destructive text-destructive-foreground'
      case 'info': return 'bg-primary text-primary-foreground'
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 shadow-lg"
          size="sm"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Contextual Help</CardTitle>
              <CardDescription>Tips for {activeTab}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {currentHelp.map((help, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-full ${getTypeColor(help.type)}`}>
                      {getIcon(help.type)}
                    </div>
                    <h4 className="font-medium text-sm">{help.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{help.content}</p>
                  <div className="flex flex-wrap gap-1 pl-6">
                    {help.relevantTo.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}