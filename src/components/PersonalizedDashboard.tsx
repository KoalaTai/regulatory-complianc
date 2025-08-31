import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { comprehensiveStandardsDatabase, getStandardById } from '@/data/standardsDatabase'
import { ComplianceGoalsManager } from '@/components/ComplianceGoalsManager'
import { RealTimeProgressDashboard } from '@/components/RealTimeProgressDashboard'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  Calendar,
  Star,
  Plus,
  X,
  Settings,
  Filter,
  Activity,
  BarChart3,
  Zap
} from '@phosphor-icons/react'

interface TrackedStandard {
  id: string
  name: string
  region: string
  category: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'not-started' | 'in-progress' | 'completed' | 'needs-review'
  progress: number
  lastActivity: string
  nextDeadline?: string
  notes: string
  sections: {
    id: string
    name: string
    completed: boolean
    lastReviewed?: string
  }[]
}

interface ComplianceGoal {
  id: string
  title: string
  description: string
  targetDate: string
  priority: 'high' | 'medium' | 'low'
  standardIds: string[]
  progress: number
  status: 'active' | 'completed' | 'overdue'
}

interface ActivityItem {
  id: string
  type: 'standard-added' | 'section-completed' | 'goal-created' | 'audit-completed' | 'citation-added'
  title: string
  description: string
  timestamp: string
  standardId?: string
  metadata?: any
}

const standardsLibrary = comprehensiveStandardsDatabase.map(std => ({
  id: std.id,
  name: std.name,
  region: std.region,
  category: std.category,
  description: std.description,
  sections: std.sections.map(section => ({
    id: section.id,
    name: section.title,
    completed: false
  }))
}))

export const PersonalizedDashboard = () => {
  const { user, userProfile } = useAuth()
  const [trackedStandards, setTrackedStandards] = useKV<TrackedStandard[]>("user-tracked-standards", [])
  const [complianceGoals, setComplianceGoals] = useKV<ComplianceGoal[]>("user-compliance-goals", [])
  const [recentActivity, setRecentActivity] = useKV<ActivityItem[]>("user-activity-feed", [])
  const [showAddStandard, setShowAddStandard] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDescription, setNewGoalDescription] = useState('')
  const [newGoalDate, setNewGoalDate] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Initialize with sample data if user is new
  useEffect(() => {
    if (user && trackedStandards.length === 0) {
      const sampleStandards: TrackedStandard[] = [
        {
          id: 'FDA_QSR',
          name: 'FDA 21 CFR Part 820',
          region: 'United States',
          category: 'Medical Devices',
          description: 'Quality System Regulation for medical device manufacturers',
          priority: 'high',
          status: 'in-progress',
          progress: 45,
          lastActivity: '2 days ago',
          nextDeadline: '2024-03-15',
          notes: 'Focus on design controls section next',
          sections: standardsLibrary[0].sections.map((section, index) => ({
            ...section,
            completed: index < 2, // First 2 sections completed
            lastReviewed: index < 2 ? '2024-01-15' : undefined
          }))
        },
        {
          id: 'ISO_13485',
          name: 'ISO 13485:2016',
          region: 'International',
          category: 'Medical Devices',
          description: 'Medical devices - Quality management systems',
          priority: 'medium',
          status: 'not-started',
          progress: 0,
          lastActivity: '1 week ago',
          notes: 'Planning phase',
          sections: standardsLibrary[1].sections
        }
      ]
      setTrackedStandards(sampleStandards)

      const sampleGoals: ComplianceGoal[] = [
        {
          id: '1',
          title: 'FDA QSR Compliance Certification',
          description: 'Complete all FDA QSR requirements for Class II medical device',
          targetDate: '2024-06-30',
          priority: 'high',
          standardIds: ['FDA_QSR'],
          progress: 45,
          status: 'active'
        },
        {
          id: '2',
          title: 'EU Market Entry Preparation',
          description: 'Achieve CE marking compliance for European market',
          targetDate: '2024-09-15',
          priority: 'medium',
          standardIds: ['EU_MDR', 'ISO_13485'],
          progress: 20,
          status: 'active'
        }
      ]
      setComplianceGoals(sampleGoals)

      // Add initial activity
      addActivity({
        type: 'standard-added',
        title: 'Welcome to VirtualBackroom.ai',
        description: 'Started tracking FDA QSR and ISO 13485 standards',
        standardId: 'FDA_QSR'
      })
    }
  }, [user])

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    setRecentActivity(current => [newActivity, ...current].slice(0, 50)) // Keep last 50 activities
  }

  const addStandardToTracking = (standardId: string) => {
    const standard = standardsLibrary.find(s => s.id === standardId)
    if (!standard) return

    const newTrackedStandard: TrackedStandard = {
      id: standard.id,
      name: standard.name,
      region: standard.region,
      category: standard.category,
      description: standard.description,
      priority: 'medium',
      status: 'not-started',
      progress: 0,
      lastActivity: 'Just added',
      notes: '',
      sections: standard.sections
    }

    setTrackedStandards(current => [...current, newTrackedStandard])
    addActivity({
      type: 'standard-added',
      title: 'Standard Added',
      description: `Started tracking ${standard.name}`,
      standardId: standard.id
    })
    setShowAddStandard(false)
  }

  const updateStandardProgress = (standardId: string, sectionId: string, completed: boolean) => {
    setTrackedStandards(current => 
      current.map(standard => {
        if (standard.id === standardId) {
          const updatedSections = standard.sections.map(section => 
            section.id === sectionId 
              ? { ...section, completed, lastReviewed: completed ? new Date().toISOString().split('T')[0] : undefined }
              : section
          )
          
          const completedSections = updatedSections.filter(s => s.completed).length
          const progress = Math.round((completedSections / updatedSections.length) * 100)
          
          const status = progress === 100 ? 'completed' : 
                        progress > 0 ? 'in-progress' : 'not-started'

          if (completed) {
            addActivity({
              type: 'section-completed',
              title: 'Section Completed',
              description: `Completed ${sectionId} in ${standard.name}`,
              standardId: standard.id
            })
          }

          return {
            ...standard,
            sections: updatedSections,
            progress,
            status,
            lastActivity: 'Just now'
          }
        }
        return standard
      })
    )
  }

  const createNewGoal = () => {
    if (!newGoalTitle.trim()) return

    const newGoal: ComplianceGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      targetDate: newGoalDate,
      priority: 'medium',
      standardIds: [],
      progress: 0,
      status: 'active'
    }

    setComplianceGoals(current => [...current, newGoal])
    addActivity({
      type: 'goal-created',
      title: 'New Goal Created',
      description: `Created goal: ${newGoalTitle}`
    })

    setNewGoalTitle('')
    setNewGoalDescription('')
    setNewGoalDate('')
    setShowAddGoal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-secondary text-secondary-foreground'
      case 'in-progress': return 'bg-accent text-accent-foreground'
      case 'needs-review': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground'
      case 'medium': return 'bg-accent text-accent-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const filteredStandards = trackedStandards.filter(standard => 
    filterStatus === 'all' || standard.status === filterStatus
  )

  const overallProgress = trackedStandards.length > 0 
    ? Math.round(trackedStandards.reduce((acc, std) => acc + std.progress, 0) / trackedStandards.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground">{overallProgress}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tracked Standards</p>
                <p className="text-2xl font-bold text-foreground">{trackedStandards.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold text-foreground">{complianceGoals.filter(g => g.status === 'active').length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
                <p className="text-2xl font-bold text-foreground">
                  {complianceGoals.filter(g => new Date(g.targetDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Live Monitor
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with common compliance tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddStandard(true)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <BookOpen className="h-5 w-5 text-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm">Add Standard</h3>
                              <Badge variant="secondary" className="text-xs">Quick</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Track a new regulatory standard</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddGoal(true)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Target className="h-5 w-5 text-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm">Create Goal</h3>
                              <Badge variant="secondary" className="text-xs">Planning</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Set new compliance objective</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-4">
                    {recentActivity.slice(0, 10).map((activity, index) => (
                      <div key={activity.id}>
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${
                            activity.type === 'standard-added' ? 'bg-primary' :
                            activity.type === 'section-completed' ? 'bg-secondary' :
                            activity.type === 'goal-created' ? 'bg-accent' :
                            activity.type === 'audit-completed' ? 'bg-destructive' : 'bg-muted'
                          }`}>
                            {activity.type === 'standard-added' ? <BookOpen className="h-4 w-4" /> :
                             activity.type === 'section-completed' ? <CheckCircle className="h-4 w-4" /> :
                             activity.type === 'goal-created' ? <Target className="h-4 w-4" /> :
                             activity.type === 'audit-completed' ? <CheckCircle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {index < recentActivity.slice(0, 10).length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}

                    {recentActivity.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="standards" className="space-y-6">
          {/* Tracked Standards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Tracked Standards</CardTitle>
                  <CardDescription>Monitor progress on regulatory compliance standards</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="needs-review">Needs Review</option>
                  </select>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddStandard(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Standard
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAddStandard && (
                <Card className="mb-4 border-dashed">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Add Standard to Track</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {standardsLibrary
                        .filter(std => !trackedStandards.find(ts => ts.id === std.id))
                        .map(standard => (
                        <div 
                          key={standard.id}
                          className="p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => addStandardToTracking(standard.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-sm">{standard.name}</h5>
                            <Badge variant="outline" className="text-xs">{standard.region}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{standard.description}</p>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddStandard(false)}
                      className="mt-3"
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {filteredStandards.map(standard => (
                  <Card key={standard.id} className="border-l-4" style={{ borderLeftColor: `var(--color-${standard.priority === 'high' ? 'destructive' : standard.priority === 'medium' ? 'accent' : 'muted'})` }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{standard.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(standard.status)} variant="secondary">
                                {standard.status.replace('-', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(standard.priority)} variant="secondary">
                                {standard.priority} priority
                              </Badge>
                              <span className="text-sm text-muted-foreground">{standard.region}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{standard.progress}%</div>
                          <div className="text-sm text-muted-foreground">Complete</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Progress value={standard.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {standard.sections.map(section => (
                          <div key={section.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateStandardProgress(standard.id, section.id, !section.completed)}
                                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                  section.completed 
                                    ? 'bg-secondary border-secondary text-white' 
                                    : 'border-muted-foreground hover:border-secondary'
                                }`}
                              >
                                {section.completed && <CheckCircle className="h-3 w-3" />}
                              </button>
                              <div>
                                <div className="font-medium text-sm">{section.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {section.lastReviewed ? `Reviewed ${section.lastReviewed}` : 'Not reviewed'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {standard.nextDeadline && (
                        <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium">Next Deadline: {standard.nextDeadline}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {filteredStandards.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No standards tracked yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first standard to start tracking compliance progress</p>
                    <Button onClick={() => setShowAddStandard(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Standard
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <ComplianceGoalsManager />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeProgressDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Standards Completion Rate</span>
                      <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Goals Achievement</span>
                      <span className="text-sm text-muted-foreground">
                        {complianceGoals.filter(g => g.status === 'completed').length} of {complianceGoals.length}
                      </span>
                    </div>
                    <Progress 
                      value={complianceGoals.length > 0 ? (complianceGoals.filter(g => g.status === 'completed').length / complianceGoals.length) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {trackedStandards.filter(s => s.status === 'completed').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed Standards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {trackedStandards.reduce((acc, std) => acc + std.sections.filter(s => s.completed).length, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Sections Completed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {Math.round(recentActivity.length / 7)}
                      </div>
                      <div className="text-sm text-muted-foreground">Activities/Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-destructive">
                        {complianceGoals.filter(g => new Date(g.targetDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Due This Week</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Recent Performance</h4>
                    <div className="space-y-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm">{day}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.random() * 100} className="w-16 h-1" />
                            <span className="text-xs text-muted-foreground w-8">
                              {Math.floor(Math.random() * 4) + 1}h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Upcoming Deadlines & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceGoals
                  .filter(goal => {
                    const daysUntil = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return daysUntil <= 30 && daysUntil >= 0
                  })
                  .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                  .map(goal => {
                    const daysUntil = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={goal.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            daysUntil <= 7 ? 'bg-destructive' : 
                            daysUntil <= 14 ? 'bg-yellow-500' : 'bg-accent'
                          }`} />
                          <div>
                            <div className="font-medium">{goal.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Due in {daysUntil} days • {goal.progress}% complete
                            </div>
                          </div>
                        </div>
                        <Badge variant={daysUntil <= 7 ? 'destructive' : 'secondary'}>
                          {daysUntil <= 7 ? 'Urgent' : 'Upcoming'}
                        </Badge>
                      </div>
                    )
                  })}
                
                {complianceGoals.filter(goal => {
                  const daysUntil = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return daysUntil <= 30 && daysUntil >= 0
                }).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-muted-foreground">No upcoming deadlines in the next 30 days</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Standard Modal */}
      {showAddStandard && (
        <Card className="mb-4 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Add Standard to Track</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowAddStandard(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {standardsLibrary
                .filter(std => !trackedStandards.find(ts => ts.id === std.id))
                .slice(0, 6)
                .map(standard => (
                <div 
                  key={standard.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => addStandardToTracking(standard.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-sm">{standard.name}</h5>
                    <Badge variant="outline" className="text-xs">{standard.region}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{standard.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <Card className="mb-4 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Create New Goal</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowAddGoal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Goal title"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Target date"
                value={newGoalDate}
                onChange={(e) => setNewGoalDate(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={createNewGoal} disabled={!newGoalTitle.trim()}>
                  Create Goal
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}