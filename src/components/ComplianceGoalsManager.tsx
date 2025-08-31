import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { comprehensiveStandardsDatabase } from '@/data/standardsDatabase'
import { 
  Target, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Flag,
  Award,
  Users,
  FileText,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Activity
} from '@phosphor-icons/react'

interface ComplianceGoal {
  id: string
  title: string
  description: string
  targetDate: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'certification' | 'audit-prep' | 'training' | 'documentation' | 'process-improvement'
  standardIds: string[]
  progress: number
  status: 'active' | 'completed' | 'overdue' | 'paused' | 'cancelled'
  createdAt: string
  updatedAt: string
  assignee?: string
  milestones: GoalMilestone[]
  metrics: GoalMetrics
  reminders: GoalReminder[]
  dependencies: string[] // Other goal IDs this depends on
}

interface GoalMilestone {
  id: string
  title: string
  description: string
  targetDate: string
  completed: boolean
  completedDate?: string
  progress: number
}

interface GoalMetrics {
  sectionsCompleted: number
  totalSections: number
  auditsCompleted: number
  documentsCreated: number
  trainingSessions: number
  timeSpent: number // in minutes
}

interface GoalReminder {
  id: string
  type: 'deadline' | 'milestone' | 'progress-check'
  message: string
  triggerDate: string
  sent: boolean
}

interface ProgressAlert {
  id: string
  type: 'behind-schedule' | 'milestone-missed' | 'dependency-blocked' | 'completion-ready'
  goalId: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  acknowledged: boolean
}

export const ComplianceGoalsManager = () => {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [goals, setGoals] = useKV<ComplianceGoal[]>("user-compliance-goals-v2", [])
  const [alerts, setAlerts] = useKV<ProgressAlert[]>("goal-progress-alerts", [])
  const [showCreateGoal, setShowCreateGoal] = useState(false)
  const [showGoalDetails, setShowGoalDetails] = useState<string | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<ComplianceGoal | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('active')
  
  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    priority: 'medium' as const,
    category: 'certification' as const,
    standardIds: [] as string[],
    assignee: user?.email || ''
  })

  // Real-time progress monitoring
  useEffect(() => {
    if (goals.length > 0) {
      const interval = setInterval(() => {
        updateGoalProgress()
        checkProgressAlerts()
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [goals])

  // Initialize with sample goals for demo
  useEffect(() => {
    if (user && goals.length === 0) {
      const sampleGoals: ComplianceGoal[] = [
        {
          id: '1',
          title: 'FDA 510(k) Submission Readiness',
          description: 'Complete all requirements for FDA 510(k) premarket submission for Class II medical device',
          targetDate: '2024-06-30',
          priority: 'critical',
          category: 'certification',
          standardIds: ['FDA_QSR', 'FDA_510K'],
          progress: 65,
          status: 'active',
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date().toISOString(),
          assignee: user.email || '',
          milestones: [
            {
              id: 'm1',
              title: 'Design Controls Documentation',
              description: 'Complete all design control documentation per 21 CFR 820.30',
              targetDate: '2024-03-15',
              completed: true,
              completedDate: '2024-03-10',
              progress: 100
            },
            {
              id: 'm2',
              title: 'Clinical Evaluation',
              description: 'Complete clinical evaluation and predicate device comparison',
              targetDate: '2024-05-01',
              completed: false,
              progress: 80
            },
            {
              id: 'm3',
              title: 'Labeling Review',
              description: 'Finalize product labeling and user instructions',
              targetDate: '2024-06-01',
              completed: false,
              progress: 30
            }
          ],
          metrics: {
            sectionsCompleted: 12,
            totalSections: 18,
            auditsCompleted: 2,
            documentsCreated: 24,
            trainingSessions: 3,
            timeSpent: 2400 // 40 hours
          },
          reminders: [],
          dependencies: []
        },
        {
          id: '2',
          title: 'ISO 13485:2016 Certification',
          description: 'Achieve ISO 13485:2016 certification for quality management system',
          targetDate: '2024-09-15',
          priority: 'high',
          category: 'certification',
          standardIds: ['ISO_13485'],
          progress: 35,
          status: 'active',
          createdAt: new Date('2024-01-20').toISOString(),
          updatedAt: new Date().toISOString(),
          assignee: user.email || '',
          milestones: [
            {
              id: 'm4',
              title: 'Gap Analysis',
              description: 'Complete comprehensive gap analysis against ISO 13485:2016',
              targetDate: '2024-04-01',
              completed: true,
              completedDate: '2024-03-25',
              progress: 100
            },
            {
              id: 'm5',
              title: 'QMS Implementation',
              description: 'Implement quality management system procedures',
              targetDate: '2024-07-01',
              completed: false,
              progress: 45
            }
          ],
          metrics: {
            sectionsCompleted: 8,
            totalSections: 23,
            auditsCompleted: 1,
            documentsCreated: 15,
            trainingSessions: 2,
            timeSpent: 1800 // 30 hours
          },
          reminders: [],
          dependencies: []
        }
      ]
      setGoals(sampleGoals)
    }
  }, [user])

  const updateGoalProgress = () => {
    setGoals(currentGoals => 
      currentGoals.map(goal => {
        // Calculate progress based on milestones
        const totalMilestones = goal.milestones.length
        const completedMilestones = goal.milestones.filter(m => m.completed).length
        const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0
        
        // Calculate weighted progress based on metrics
        const metricsProgress = goal.metrics.totalSections > 0 
          ? (goal.metrics.sectionsCompleted / goal.metrics.totalSections) * 100 
          : 0
        
        // Combine milestone and metrics progress
        const calculatedProgress = Math.round((milestoneProgress * 0.6) + (metricsProgress * 0.4))
        
        // Update status based on progress and dates
        let status = goal.status
        if (calculatedProgress >= 100) {
          status = 'completed'
        } else if (new Date(goal.targetDate) < new Date() && status === 'active') {
          status = 'overdue'
        }

        return {
          ...goal,
          progress: calculatedProgress,
          status,
          updatedAt: new Date().toISOString()
        }
      })
    )
  }

  const checkProgressAlerts = () => {
    const newAlerts: ProgressAlert[] = []
    const now = new Date()

    goals.forEach(goal => {
      if (goal.status !== 'completed' && goal.status !== 'cancelled') {
        const targetDate = new Date(goal.targetDate)
        const daysUntilDeadline = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        // Behind schedule alert
        if (daysUntilDeadline > 0 && daysUntilDeadline <= 30 && goal.progress < 70) {
          newAlerts.push({
            id: `alert-${goal.id}-behind`,
            type: 'behind-schedule',
            goalId: goal.id,
            message: `Goal "${goal.title}" is behind schedule with ${goal.progress}% progress and ${daysUntilDeadline} days remaining`,
            severity: daysUntilDeadline <= 7 ? 'critical' : 'high',
            createdAt: new Date().toISOString(),
            acknowledged: false
          })
        }
        
        // Overdue milestone alert
        goal.milestones.forEach(milestone => {
          if (!milestone.completed && new Date(milestone.targetDate) < now) {
            newAlerts.push({
              id: `alert-${goal.id}-milestone-${milestone.id}`,
              type: 'milestone-missed',
              goalId: goal.id,
              message: `Milestone "${milestone.title}" in goal "${goal.title}" is overdue`,
              severity: 'high',
              createdAt: new Date().toISOString(),
              acknowledged: false
            })
          }
        })
        
        // Ready for completion
        if (goal.progress >= 95 && goal.status === 'active') {
          newAlerts.push({
            id: `alert-${goal.id}-completion`,
            type: 'completion-ready',
            goalId: goal.id,
            message: `Goal "${goal.title}" is ${goal.progress}% complete and ready for final review`,
            severity: 'medium',
            createdAt: new Date().toISOString(),
            acknowledged: false
          })
        }
      }
    })

    // Add new alerts that don't already exist
    setAlerts(currentAlerts => {
      const existingAlertIds = new Set(currentAlerts.map(a => a.id))
      const uniqueNewAlerts = newAlerts.filter(alert => !existingAlertIds.has(alert.id))
      return [...currentAlerts, ...uniqueNewAlerts].slice(0, 50) // Keep last 50 alerts
    })
  }

  const createNewGoal = async () => {
    if (!newGoal.title.trim()) return

    const goal: ComplianceGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      category: newGoal.category,
      standardIds: newGoal.standardIds,
      progress: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: newGoal.assignee,
      milestones: [],
      metrics: {
        sectionsCompleted: 0,
        totalSections: 0,
        auditsCompleted: 0,
        documentsCreated: 0,
        trainingSessions: 0,
        timeSpent: 0
      },
      reminders: [],
      dependencies: []
    }

    setGoals(current => [...current, goal])
    
    // Update user stats
    if (userProfile) {
      await updateUserProfile({
        stats: {
          ...userProfile.stats,
          goalsCompleted: userProfile.stats.goalsCompleted + (goal.status === 'completed' ? 1 : 0)
        }
      })
    }

    // Reset form
    setNewGoal({
      title: '',
      description: '',
      targetDate: '',
      priority: 'medium',
      category: 'certification',
      standardIds: [],
      assignee: user?.email || ''
    })
    setShowCreateGoal(false)
  }

  const updateGoalStatus = (goalId: string, status: ComplianceGoal['status']) => {
    setGoals(current => 
      current.map(goal => 
        goal.id === goalId 
          ? { ...goal, status, updatedAt: new Date().toISOString() }
          : goal
      )
    )
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(current => 
      current.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    )
  }

  const getStatusColor = (status: ComplianceGoal['status']) => {
    switch (status) {
      case 'completed': return 'bg-secondary text-secondary-foreground'
      case 'active': return 'bg-accent text-accent-foreground'
      case 'overdue': return 'bg-destructive text-destructive-foreground'
      case 'paused': return 'bg-muted text-muted-foreground'
      case 'cancelled': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: ComplianceGoal['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white'
      case 'high': return 'bg-destructive text-destructive-foreground'
      case 'medium': return 'bg-accent text-accent-foreground'
      case 'low': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = filterCategory === 'all' || goal.category === filterCategory
    const statusMatch = filterStatus === 'all' || goal.status === filterStatus
    return categoryMatch && statusMatch
  })

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged)

  return (
    <div className="space-y-6">
      {/* Alerts Banner */}
      {unacknowledgedAlerts.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-destructive">Progress Alerts</h4>
                <div className="mt-2 space-y-2">
                  {unacknowledgedAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{alert.message}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  ))}
                  {unacknowledgedAlerts.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      And {unacknowledgedAlerts.length - 3} more alerts...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{goals.filter(g => g.status === 'active').length}</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{goals.filter(g => g.status === 'completed').length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{goals.filter(g => g.status === 'overdue').length}</p>
              </div>
              <Clock className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">
                  {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Goals</CardTitle>
              <CardDescription>Monitor and manage your regulatory compliance objectives</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="audit-prep">Audit Prep</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="process-improvement">Process Improvement</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setShowCreateGoal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Goal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGoals.map(goal => (
              <Card key={goal.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                          {goal.priority}
                        </Badge>
                        <Badge className={getStatusColor(goal.status)} variant="secondary">
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(goal.targetDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {goal.assignee}
                        </div>
                        <div className="flex items-center gap-1">
                          <Flag className="h-4 w-4" />
                          {goal.category.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold">{goal.progress}%</div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  {/* Milestones Preview */}
                  {goal.milestones.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Milestones</h4>
                      <div className="flex gap-2 flex-wrap">
                        {goal.milestones.map(milestone => (
                          <Badge 
                            key={milestone.id} 
                            variant={milestone.completed ? "default" : "outline"}
                            className="text-xs"
                          >
                            {milestone.completed ? <CheckCircle2 className="mr-1 h-3 w-3" /> : null}
                            {milestone.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedGoal(goal)
                          setShowGoalDetails(goal.id)
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </Button>
                      {goal.status === 'active' && goal.progress >= 95 && (
                        <Button 
                          size="sm"
                          onClick={() => updateGoalStatus(goal.id, 'completed')}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(goal.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredGoals.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No goals found</h3>
                <p className="text-muted-foreground mb-4">
                  {filterStatus === 'all' && filterCategory === 'all' 
                    ? 'Create your first compliance goal to start tracking progress'
                    : 'No goals match your current filters. Try adjusting the filters above.'
                  }
                </p>
                <Button onClick={() => setShowCreateGoal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Goal Dialog */}
      <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Compliance Goal</DialogTitle>
            <DialogDescription>
              Set up a new compliance goal to track your regulatory objectives
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Goal Title</label>
              <Input
                placeholder="e.g., FDA 510(k) Submission Readiness"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the goal objectives and scope..."
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Target Date</label>
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={newGoal.priority} onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="audit-prep">Audit Preparation</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="process-improvement">Process Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Related Standards</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select related standards" />
                </SelectTrigger>
                <SelectContent>
                  {comprehensiveStandardsDatabase.map(standard => (
                    <SelectItem key={standard.id} value={standard.id}>
                      {standard.name} ({standard.region})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateGoal(false)}>
                Cancel
              </Button>
              <Button onClick={createNewGoal} disabled={!newGoal.title.trim()}>
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Details Dialog */}
      {selectedGoal && (
        <Dialog open={!!showGoalDetails} onOpenChange={() => setShowGoalDetails(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedGoal.title}</DialogTitle>
              <DialogDescription>
                Detailed view and progress tracking
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-primary">{selectedGoal.progress}%</div>
                        <Progress value={selectedGoal.progress} className="mt-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Status</div>
                          <Badge className={getStatusColor(selectedGoal.status)}>
                            {selectedGoal.status}
                          </Badge>
                        </div>
                        <div>
                          <div className="font-medium">Priority</div>
                          <Badge className={getPriorityColor(selectedGoal.priority)}>
                            {selectedGoal.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="font-medium text-sm">Target Date</div>
                        <div className="text-muted-foreground">{new Date(selectedGoal.targetDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Category</div>
                        <div className="text-muted-foreground">{selectedGoal.category.replace('-', ' ')}</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Assignee</div>
                        <div className="text-muted-foreground">{selectedGoal.assignee}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                <div className="space-y-3">
                  {selectedGoal.milestones.map(milestone => (
                    <Card key={milestone.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              milestone.completed 
                                ? 'bg-secondary border-secondary' 
                                : 'border-muted-foreground'
                            }`}>
                              {milestone.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                            <div>
                              <div className="font-medium">{milestone.title}</div>
                              <div className="text-sm text-muted-foreground">{milestone.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{milestone.progress}%</div>
                            <div className="text-sm text-muted-foreground">
                              Due: {new Date(milestone.targetDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Progress value={milestone.progress} className="mt-3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{selectedGoal.metrics.sectionsCompleted}</div>
                      <div className="text-sm text-muted-foreground">Sections Completed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{selectedGoal.metrics.documentsCreated}</div>
                      <div className="text-sm text-muted-foreground">Documents Created</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{Math.round(selectedGoal.metrics.timeSpent / 60)}</div>
                      <div className="text-sm text-muted-foreground">Hours Spent</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">Goal created</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(selectedGoal.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {selectedGoal.milestones
                      .filter(m => m.completed)
                      .map(milestone => (
                        <div key={milestone.id} className="flex items-center gap-3 p-3 border rounded-md">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          <div>
                            <div className="font-medium text-sm">Milestone completed: {milestone.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {milestone.completedDate && new Date(milestone.completedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}