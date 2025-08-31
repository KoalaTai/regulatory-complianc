import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Play, CheckCircle, AlertTriangle, Clock, FileText, Target, Users, Shield, Sparkles, RefreshCw, SignIn } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { useUserStats } from '@/hooks/usePersonalization'

interface AuditStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
  requirements: string[]
}

interface AuditSimulation {
  id: string
  standard: string
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  steps: AuditStep[]
  createdAt: Date
  aiGenerated?: boolean
  scenario?: string
}

export function AuditSimulator() {
  const { user } = useAuth()
  const { incrementAuditSimulations } = useUserStats()
  
  // Use user-specific simulation key when authenticated
  const simulationKey = user ? `audit-simulations-${user.uid}` : 'audit-simulations'
  const [simulations, setSimulations] = useKV<AuditSimulation[]>(simulationKey, [])
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null)
  const [selectedStandard, setSelectedStandard] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const standards = [
    { id: 'fda-qsr', name: 'FDA 21 CFR Part 820', description: 'Quality System Regulation' },
    { id: 'iso-13485', name: 'ISO 13485:2016', description: 'Medical Device QMS' },
    { id: 'eu-mdr', name: 'EU MDR 2017/745', description: 'European Medical Device Regulation' },
    { id: 'iso-14971', name: 'ISO 14971:2019', description: 'Risk Management for Medical Devices' }
  ]

  const createSimulation = () => {
    if (!selectedStandard) return

    const standard = standards.find(s => s.id === selectedStandard)
    if (!standard) return

    const newSimulation: AuditSimulation = {
      id: Date.now().toString(),
      standard: standard.name,
      progress: 0,
      status: 'not_started',
      createdAt: new Date(),
      steps: [
        {
          id: 'scope',
          title: 'Define Audit Scope',
          description: 'Identify the processes, departments, and requirements to be audited',
          completed: false,
          required: true,
          requirements: [
            'Identify applicable regulatory requirements',
            'Define organizational scope',
            'List processes to be evaluated',
            'Establish audit criteria'
          ]
        },
        {
          id: 'team',
          title: 'Assemble Audit Team',
          description: 'Select qualified auditors and define roles',
          completed: false,
          required: true,
          requirements: [
            'Select lead auditor',
            'Choose technical experts',
            'Ensure independence',
            'Define team responsibilities'
          ]
        },
        {
          id: 'planning',
          title: 'Audit Planning',
          description: 'Create detailed audit plan and schedule',
          completed: false,
          required: true,
          requirements: [
            'Develop audit plan',
            'Create audit checklist',
            'Schedule activities',
            'Prepare documentation'
          ]
        },
        {
          id: 'execution',
          title: 'Conduct Audit',
          description: 'Execute audit activities and collect evidence',
          completed: false,
          required: true,
          requirements: [
            'Review documentation',
            'Interview personnel',
            'Observe processes',
            'Collect objective evidence'
          ]
        },
        {
          id: 'findings',
          title: 'Document Findings',
          description: 'Record observations and identify non-conformities',
          completed: false,
          required: true,
          requirements: [
            'Document observations',
            'Classify findings',
            'Verify evidence',
            'Prepare preliminary results'
          ]
        },
        {
          id: 'report',
          title: 'Audit Report',
          description: 'Prepare and present final audit report',
          completed: false,
          required: true,
          requirements: [
            'Compile findings',
            'Write executive summary',
            'Include recommendations',
            'Present to management'
          ]
        }
      ]
    }

    setSimulations(prev => [...prev, newSimulation])
    setActiveSimulation(newSimulation.id)
  }

  const createAISimulation = async () => {
    if (!selectedStandard || isGeneratingAI) return

    const standard = standards.find(s => s.id === selectedStandard)
    if (!standard) return

    setIsGeneratingAI(true)
    try {
      const prompt = spark.llmPrompt`Generate a realistic audit simulation scenario for ${standard.name} (${standard.description}).

      Create a detailed audit simulation with:
      1. A realistic company scenario (type of device, size of company, specific challenges)
      2. 6 customized audit preparation steps with specific requirements for this scenario
      3. Each step should have 4-5 specific requirements tailored to the scenario

      Return as JSON with this structure:
      {
        "scenario": "Brief description of the company and device scenario",
        "steps": [
          {
            "id": "step-id",
            "title": "Step Title",
            "description": "Step description",
            "requirements": ["req1", "req2", "req3", "req4"]
          }
        ]
      }`

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const aiData = JSON.parse(response)

      const newSimulation: AuditSimulation = {
        id: Date.now().toString(),
        standard: standard.name,
        progress: 0,
        status: 'not_started',
        createdAt: new Date(),
        aiGenerated: true,
        scenario: aiData.scenario,
        steps: aiData.steps.map((step: any) => ({
          ...step,
          completed: false,
          required: true
        }))
      }

      setSimulations(prev => [...prev, newSimulation])
      setActiveSimulation(newSimulation.id)
    } catch (error) {
      console.error('Failed to generate AI simulation:', error)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const toggleStepCompletion = (simulationId: string, stepId: string) => {
    setSimulations(prev => prev.map(sim => {
      if (sim.id !== simulationId) return sim
      
      const updatedSteps = sim.steps.map(step => {
        if (step.id === stepId) {
          return { ...step, completed: !step.completed }
        }
        return step
      })
      
      const completedSteps = updatedSteps.filter(step => step.completed).length
      const progress = (completedSteps / updatedSteps.length) * 100
      const newStatus = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started'
      
      // Increment user stats when simulation is completed for the first time
      if (sim.status !== 'completed' && newStatus === 'completed') {
        incrementAuditSimulations()
      }
      
      return { ...sim, steps: updatedSteps, progress, status: newStatus }
    }))
  }

  const currentSimulation = simulations.find(sim => sim.id === activeSimulation)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'in_progress': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      default: return <Play className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Preparation Simulator</CardTitle>
              <CardDescription>Practice audit readiness with interactive simulations</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select standard for new simulation" />
                </SelectTrigger>
                <SelectContent>
                  {standards.map(standard => (
                    <SelectItem key={standard.id} value={standard.id}>
                      {standard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={createSimulation} disabled={!selectedStandard}>
                <Play className="mr-2 h-4 w-4" />
                Start Simulation
              </Button>
              <Button 
                onClick={createAISimulation} 
                disabled={!selectedStandard || isGeneratingAI}
                variant="outline"
              >
                {isGeneratingAI ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                AI Scenario
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulations List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {simulations.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">No simulations yet</p>
                  <p className="text-xs text-muted-foreground">Select a standard and start your first simulation</p>
                  {!user && (
                    <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 max-w-sm mx-auto mt-4">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <SignIn className="h-4 w-4" />
                        <span className="text-sm font-medium">Sign in to save progress</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Keep your audit simulations and track progress across sessions.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {simulations.map((simulation) => (
                    <Card
                      key={simulation.id}
                      className={`cursor-pointer transition-colors ${
                        activeSimulation === simulation.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveSimulation(simulation.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            {simulation.standard}
                            {simulation.aiGenerated && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </h4>
                          <Badge variant={simulation.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {simulation.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round(simulation.progress)}%</span>
                          </div>
                          <Progress value={simulation.progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {getStatusIcon(simulation.status)}
                          <span>Created {simulation.createdAt.toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Simulation Details */}
        <div className="lg:col-span-2">
          {currentSimulation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {currentSimulation.standard}
                      {currentSimulation.aiGenerated && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Audit Preparation Steps</CardDescription>
                    {currentSimulation.scenario && (
                      <div className="mt-2 p-3 bg-accent/20 rounded-lg">
                        <p className="text-sm text-accent-foreground font-medium">Scenario:</p>
                        <p className="text-sm text-muted-foreground mt-1">{currentSimulation.scenario}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={currentSimulation.status === 'completed' ? 'default' : 'secondary'}>
                      {currentSimulation.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(currentSimulation.progress)}% Complete
                    </span>
                  </div>
                </div>
                <Progress value={currentSimulation.progress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {currentSimulation.steps.map((step, index) => (
                      <div key={step.id}>
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                              step.completed 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'border-muted-foreground text-muted-foreground'
                            }`}>
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <span className="text-xs font-medium">{index + 1}</span>
                              )}
                            </div>
                            {index < currentSimulation.steps.length - 1 && (
                              <div className="h-8 w-px bg-border mt-2" />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {step.required && (
                                  <Badge variant="outline" className="text-xs">Required</Badge>
                                )}
                                <Checkbox
                                  checked={step.completed}
                                  onCheckedChange={() => toggleStepCompletion(currentSimulation.id, step.id)}
                                />
                              </div>
                            </div>
                            
                            <Card className="bg-muted/50">
                              <CardContent className="p-4">
                                <h4 className="font-medium text-sm mb-2">Key Requirements:</h4>
                                <ul className="space-y-1">
                                  {step.requirements.map((req, reqIndex) => (
                                    <li key={reqIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        {index < currentSimulation.steps.length - 1 && <div className="h-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No Simulation Selected</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select an existing simulation from the sidebar or create a new one to begin your audit preparation.
                </p>
                <div className="flex justify-center gap-2">
                  <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Choose a standard" />
                    </SelectTrigger>
                    <SelectContent>
                      {standards.map(standard => (
                        <SelectItem key={standard.id} value={standard.id}>
                          {standard.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={createSimulation} disabled={!selectedStandard}>
                    <Play className="mr-2 h-4 w-4" />
                    Start New Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {simulations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {simulations.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Simulations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {simulations.filter(s => s.status === 'completed').length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {simulations.filter(s => s.status === 'in_progress').length}
              </div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {Math.round(simulations.reduce((acc, sim) => acc + sim.progress, 0) / simulations.length) || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Average Progress</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}