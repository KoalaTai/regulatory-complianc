import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, Play, CheckCircle, AlertTriangle, Clock, FileText, Target, TrendUp } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface AuditScenario {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: number
  questions: Array<{
    id: string
    question: string
    type: 'multiple-choice' | 'open-ended'
    options?: string[]
    correctAnswer?: string
    context?: string
    guidance?: string
  }>
}

interface AuditSession {
  id: string
  scenarioId: string
  startTime: Date
  answers: Record<string, string>
  score?: number
  feedback?: string
  completed: boolean
}

export function AuditSimulator() {
  const [auditSessions, setAuditSessions] = useKV<AuditSession[]>('audit-sessions', [])
  const [selectedScenario, setSelectedScenario] = useState<AuditScenario | null>(null)
  const [currentSession, setCurrentSession] = useState<AuditSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [openAnswer, setOpenAnswer] = useState('')

  // Mock audit scenarios
  const auditScenarios: AuditScenario[] = [
    {
      id: 'fda-design-controls',
      title: 'FDA Design Controls Audit',
      description: 'Simulate a typical FDA inspection focused on 21 CFR Part 820.30 design controls',
      category: 'FDA QSR',
      difficulty: 'Intermediate',
      estimatedTime: 25,
      questions: [
        {
          id: 'dc1',
          question: 'An FDA inspector asks to see your design history file for a Class II device. What key documents should be immediately available?',
          type: 'multiple-choice',
          options: [
            'Only the final design outputs and verification reports',
            'Design plan, inputs, outputs, reviews, verification, validation, and transfer documents',
            'Just the design validation protocol and report',
            'Manufacturing procedures and quality manual'
          ],
          correctAnswer: 'Design plan, inputs, outputs, reviews, verification, validation, and transfer documents',
          context: 'The design history file (DHF) is a compilation of records that describes the design history of a finished device.',
          guidance: 'Per 21 CFR 820.30(j), the DHF must contain or reference records necessary to demonstrate that the design was developed in accordance with the approved design plan and requirements of the QSR.'
        },
        {
          id: 'dc2',
          question: 'How would you demonstrate that your design inputs are appropriate and address the intended use?',
          type: 'open-ended',
          context: 'The inspector is evaluating whether your design inputs meet the requirements of 21 CFR 820.30(c).',
          guidance: 'Design inputs should include functional, performance, safety, and regulatory requirements. They should be documented, reviewed, and approved by qualified personnel.'
        },
        {
          id: 'dc3',
          question: 'What is the primary difference between design verification and design validation?',
          type: 'multiple-choice',
          options: [
            'Verification is done before validation',
            'Verification confirms design outputs meet inputs; validation ensures the device meets user needs',
            'Validation is only required for Class III devices',
            'They are the same process with different names'
          ],
          correctAnswer: 'Verification confirms design outputs meet inputs; validation ensures the device meets user needs',
          context: 'Both verification and validation are required under 21 CFR 820.30.',
          guidance: 'Verification (820.30(f)) confirms design outputs meet design input requirements. Validation (820.30(g)) ensures devices conform to defined user needs under actual use conditions.'
        }
      ]
    },
    {
      id: 'iso13485-management-review',
      title: 'ISO 13485 Management Review Audit',
      description: 'Practice responding to questions about management review processes under ISO 13485',
      category: 'ISO 13485',
      difficulty: 'Beginner',
      estimatedTime: 15,
      questions: [
        {
          id: 'mr1',
          question: 'How frequently does your organization conduct management reviews?',
          type: 'multiple-choice',
          options: [
            'Monthly',
            'At planned intervals, at least annually',
            'Only when there are problems',
            'Every six months'
          ],
          correctAnswer: 'At planned intervals, at least annually',
          context: 'ISO 13485:2016 requires management reviews to be conducted at planned intervals.',
          guidance: 'Clause 5.6.1 requires management reviews at planned intervals. While not specified, annual reviews are common practice with more frequent reviews as needed.'
        },
        {
          id: 'mr2',
          question: 'Describe what inputs you provide to management review meetings.',
          type: 'open-ended',
          context: 'The auditor wants to understand if your management review inputs align with ISO 13485:2016 clause 5.6.2.',
          guidance: 'Inputs should include audit results, customer feedback, process performance, product conformity, corrective and preventive actions, changes affecting QMS, and improvement recommendations.'
        }
      ]
    },
    {
      id: 'risk-management-audit',
      title: 'ISO 14971 Risk Management Audit',
      description: 'Advanced scenario covering risk management processes and documentation',
      category: 'Risk Management',
      difficulty: 'Advanced',
      estimatedTime: 35,
      questions: [
        {
          id: 'rm1',
          question: 'Walk me through your risk management process from hazard identification to post-market surveillance.',
          type: 'open-ended',
          context: 'The auditor wants to see if you understand the complete risk management lifecycle per ISO 14971.',
          guidance: 'Should cover: risk management planning, risk analysis (hazard identification, risk estimation), risk evaluation, risk control, residual risk evaluation, and post-market surveillance.'
        },
        {
          id: 'rm2',
          question: 'How do you demonstrate that risk control measures are effective?',
          type: 'multiple-choice',
          options: [
            'Through design verification activities only',
            'By documenting the risk control measures implemented',
            'Through verification of implementation and validation of effectiveness',
            'By conducting risk analysis again'
          ],
          correctAnswer: 'Through verification of implementation and validation of effectiveness',
          context: 'ISO 14971 requires both verification and validation of risk control measures.',
          guidance: 'Clause 7.4 requires verification that risk control measures have been implemented and validation that they are effective in reducing risk.'
        }
      ]
    }
  ]

  const startAuditSession = (scenario: AuditScenario) => {
    const session: AuditSession = {
      id: Date.now().toString(),
      scenarioId: scenario.id,
      startTime: new Date(),
      answers: {},
      completed: false
    }
    
    setCurrentSession(session)
    setSelectedScenario(scenario)
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setOpenAnswer('')
    toast.success(`Started ${scenario.title}`)
  }

  const saveAnswer = () => {
    if (!currentSession || !selectedScenario) return

    const currentQuestion = selectedScenario.questions[currentQuestionIndex]
    const answer = currentQuestion.type === 'multiple-choice' ? selectedAnswer : openAnswer

    if (!answer.trim()) {
      toast.error('Please provide an answer before continuing')
      return
    }

    const updatedSession = {
      ...currentSession,
      answers: {
        ...currentSession.answers,
        [currentQuestion.id]: answer
      }
    }

    setCurrentSession(updatedSession)

    if (currentQuestionIndex < selectedScenario.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setOpenAnswer('')
      toast.success('Answer saved')
    } else {
      completeAuditSession(updatedSession)
    }
  }

  const completeAuditSession = (session: AuditSession) => {
    if (!selectedScenario) return

    // Calculate score for multiple-choice questions
    let score = 0
    let totalMCQuestions = 0
    
    selectedScenario.questions.forEach(question => {
      if (question.type === 'multiple-choice' && question.correctAnswer) {
        totalMCQuestions++
        if (session.answers[question.id] === question.correctAnswer) {
          score++
        }
      }
    })

    const finalScore = totalMCQuestions > 0 ? Math.round((score / totalMCQuestions) * 100) : 0

    const completedSession = {
      ...session,
      completed: true,
      score: finalScore,
      feedback: generateFeedback(session, selectedScenario, finalScore)
    }

    setAuditSessions(current => [...current, completedSession])
    setCurrentSession(completedSession)
    toast.success('Audit simulation completed!')
  }

  const generateFeedback = (session: AuditSession, scenario: AuditScenario, score: number): string => {
    let feedback = `Audit simulation completed with a score of ${score}%.\n\n`

    if (score >= 80) {
      feedback += "Excellent performance! You demonstrated strong understanding of regulatory requirements."
    } else if (score >= 60) {
      feedback += "Good performance with room for improvement. Review the areas where you missed questions."
    } else {
      feedback += "Consider additional training in this regulatory area before a real audit."
    }

    feedback += "\n\nKey Areas for Review:\n"
    
    scenario.questions.forEach(question => {
      if (question.type === 'multiple-choice' && question.correctAnswer) {
        const userAnswer = session.answers[question.id]
        if (userAnswer !== question.correctAnswer) {
          feedback += `• ${question.question.substring(0, 50)}...\n`
        }
      }
    })

    return feedback
  }

  const resetSimulation = () => {
    setCurrentSession(null)
    setSelectedScenario(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setOpenAnswer('')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-secondary'
      case 'Intermediate': return 'bg-accent'
      case 'Advanced': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  if (currentSession && selectedScenario) {
    const currentQuestion = selectedScenario.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / selectedScenario.questions.length) * 100

    if (currentSession.completed) {
      // Show results
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Audit Simulation Complete</h2>
            <p className="text-muted-foreground">Review your performance and get recommendations</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {selectedScenario.title} - Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{currentSession.score}%</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">{selectedScenario.questions.length}</div>
                    <div className="text-sm text-muted-foreground">Questions Answered</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {Math.round((new Date().getTime() - currentSession.startTime.getTime()) / 60000)}m
                    </div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
                  </CardContent>
                </Card>
              </div>

              {currentSession.feedback && (
                <div>
                  <h3 className="font-semibold mb-2">Detailed Feedback</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="whitespace-pre-line text-sm">{currentSession.feedback}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={resetSimulation}>
                  Try Another Simulation
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Show current question
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{selectedScenario.title}</h2>
            <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {selectedScenario.questions.length}</p>
          </div>
          <Button variant="outline" onClick={resetSimulation}>
            Exit Simulation
          </Button>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground text-center">
            {Math.round(progress)}% Complete
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
            {currentQuestion.context && (
              <CardDescription>{currentQuestion.context}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">{currentQuestion.question}</div>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Provide a detailed response..."
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                rows={6}
                className="resize-none"
              />
            )}

            {currentQuestion.guidance && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm mb-1">Guidance</div>
                    <div className="text-sm text-muted-foreground">{currentQuestion.guidance}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button onClick={saveAnswer}>
                {currentQuestionIndex === selectedScenario.questions.length - 1 ? 'Complete Simulation' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show scenario selection
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Audit Preparation Simulator</h2>
        <p className="text-muted-foreground">Practice with realistic audit scenarios to build confidence</p>
      </div>

      {auditSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{auditSessions.length}</div>
                <div className="text-sm text-muted-foreground">Simulations Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {auditSessions.length > 0 ? Math.round(auditSessions.reduce((acc, session) => acc + (session.score || 0), 0) / auditSessions.length) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {new Set(auditSessions.map(session => session.scenarioId)).size}
                </div>
                <div className="text-sm text-muted-foreground">Different Topics</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditScenarios.map(scenario => (
          <Card key={scenario.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
                <Badge className={getDifficultyColor(scenario.difficulty)}>
                  {scenario.difficulty}
                </Badge>
              </div>
              <CardDescription>{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {scenario.estimatedTime} min
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {scenario.questions.length} questions
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Badge variant="outline">{scenario.category}</Badge>
                <div className="text-sm text-muted-foreground">
                  Practice responding to {scenario.category} audit questions with realistic scenarios
                </div>
              </div>

              <Button 
                onClick={() => startAuditSession(scenario)}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Simulation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}