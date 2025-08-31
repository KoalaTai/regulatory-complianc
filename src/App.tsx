import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { BookOpen, MessageCircle, Shield, Search, Brain, FileCheck, Users, Globe } from '@phosphor-icons/react'
import { StandardsBrowser } from '@/components/StandardsBrowser'
import { AIAssistant } from '@/components/AIAssistant'
import { AuditSimulator } from '@/components/AuditSimulator'
import { CitationManager } from '@/components/CitationManager'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const stats = [
    { label: 'Regulatory Standards', value: '150+', icon: BookOpen, color: 'bg-primary' },
    { label: 'AI Conversations', value: '2.3k', icon: MessageCircle, color: 'bg-secondary' },
    { label: 'Audit Simulations', value: '45', icon: Shield, color: 'bg-accent' },
    { label: 'Citations Managed', value: '890', icon: FileCheck, color: 'bg-destructive' },
  ]

  const quickActions = [
    {
      title: 'FDA QSR Compliance',
      description: 'Quick access to 21 CFR Part 820 requirements',
      icon: Shield,
      action: () => setActiveTab('standards'),
      badge: 'Updated'
    },
    {
      title: 'ISO 13485:2016',
      description: 'Medical device quality management systems',
      icon: Globe,
      action: () => setActiveTab('standards'),
      badge: 'Popular'
    },
    {
      title: 'EU MDR Guidance',
      description: 'European Medical Device Regulation 2017/745',
      icon: Users,
      action: () => setActiveTab('standards'),
      badge: 'New'
    },
    {
      title: 'Ask AI Assistant',
      description: 'Get instant regulatory guidance',
      icon: Brain,
      action: () => setActiveTab('assistant'),
      badge: 'AI'
    }
  ]

  const recentActivity = [
    { type: 'search', text: 'Searched for "design controls FDA"', time: '2 hours ago' },
    { type: 'chat', text: 'Asked about ISO 14971 risk management', time: '1 day ago' },
    { type: 'audit', text: 'Completed QSR audit simulation', time: '3 days ago' },
    { type: 'citation', text: 'Added 5 citations to compliance document', time: '1 week ago' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VirtualBackroom.ai</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Regulatory Compliance Platform</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Search Standards
            </Button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="audit">Audit Prep</TabsTrigger>
            <TabsTrigger value="citations">Citations</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="border-l-4" style={{ borderLeftColor: `var(--color-${stat.color.split('-')[1]})` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with common regulatory tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <action.icon className="h-5 w-5 text-foreground" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-sm">{action.title}</h3>
                                  <Badge variant="secondary" className="text-xs">{action.badge}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{action.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest compliance work</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index}>
                          <div className="flex items-start gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${
                              activity.type === 'search' ? 'bg-primary' :
                              activity.type === 'chat' ? 'bg-secondary' :
                              activity.type === 'audit' ? 'bg-accent' : 'bg-destructive'
                            }`}>
                              {activity.type === 'search' ? <Search className="h-4 w-4" /> :
                               activity.type === 'chat' ? <MessageCircle className="h-4 w-4" /> :
                               activity.type === 'audit' ? <Shield className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">{activity.text}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                          {index < recentActivity.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Standards Browser Tab */}
          <TabsContent value="standards">
            <StandardsBrowser />
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="assistant">
            <AIAssistant />
          </TabsContent>

          {/* Audit Simulator Tab */}
          <TabsContent value="audit">
            <AuditSimulator />
          </TabsContent>

          {/* Citation Manager Tab */}
          <TabsContent value="citations">
            <CitationManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App