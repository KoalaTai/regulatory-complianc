import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

interface ProgressMetrics {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  overdueGoals: number
  averageProgress: number
  goalsCompletedThisMonth: number
  sectionsCompletedThisWeek: number
  trendsData: {
    date: string
    progress: number
    goalsCompleted: number
    sectionsCompleted: number
  }[]
}

interface ProgressAlert {
  id: string
  type: 'deadline-approaching' | 'milestone-missed' | 'goal-completed' | 'behind-schedule'
  goalId: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  acknowledged: boolean
}

export const useRealTimeProgressMonitoring = () => {
  const [goals] = useKV("user-compliance-goals-v2", [])
  const [trackedStandards] = useKV("user-tracked-standards", [])
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics>({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    overdueGoals: 0,
    averageProgress: 0,
    goalsCompletedThisMonth: 0,
    sectionsCompletedThisWeek: 0,
    trendsData: []
  })
  const [alerts, setAlerts] = useKV<ProgressAlert[]>("progress-alerts", [])
  const [isMonitoring, setIsMonitoring] = useState(false)

  // Real-time monitoring with 30-second intervals
  useEffect(() => {
    if (goals.length > 0) {
      setIsMonitoring(true)
      const interval = setInterval(() => {
        updateProgressMetrics()
        checkForNewAlerts()
      }, 30000) // 30 seconds

      // Initial calculation
      updateProgressMetrics()
      checkForNewAlerts()

      return () => {
        clearInterval(interval)
        setIsMonitoring(false)
      }
    }
  }, [goals, trackedStandards])

  const updateProgressMetrics = () => {
    if (goals.length === 0) return

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))

    const activeGoals = goals.filter(g => g.status === 'active')
    const completedGoals = goals.filter(g => g.status === 'completed')
    const overdueGoals = goals.filter(g => 
      g.status === 'active' && new Date(g.targetDate) < now
    )

    const averageProgress = goals.length > 0 
      ? goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length
      : 0

    const goalsCompletedThisMonth = completedGoals.filter(goal => 
      goal.updatedAt && new Date(goal.updatedAt) >= startOfMonth
    ).length

    const sectionsCompletedThisWeek = trackedStandards.reduce((acc, standard) => 
      acc + standard.sections.filter(section => 
        section.completed && 
        section.lastReviewed && 
        new Date(section.lastReviewed) >= startOfWeek
      ).length, 0
    )

    // Generate trends data for the last 30 days
    const trendsData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simulate trend data - in a real app, this would come from historical data
      const dayProgress = Math.max(0, averageProgress - (Math.random() * 10 * i / 30))
      const dayGoalsCompleted = i < 7 ? Math.floor(Math.random() * 2) : 0
      const daySectionsCompleted = Math.floor(Math.random() * 5)

      trendsData.push({
        date: date.toISOString().split('T')[0],
        progress: Math.round(dayProgress),
        goalsCompleted: dayGoalsCompleted,
        sectionsCompleted: daySectionsCompleted
      })
    }

    setProgressMetrics({
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      overdueGoals: overdueGoals.length,
      averageProgress: Math.round(averageProgress),
      goalsCompletedThisMonth,
      sectionsCompletedThisWeek,
      trendsData
    })
  }

  const checkForNewAlerts = () => {
    const newAlerts: ProgressAlert[] = []
    const now = new Date()

    goals.forEach(goal => {
      if (goal.status === 'active') {
        const targetDate = new Date(goal.targetDate)
        const daysUntilDeadline = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        // Deadline approaching alerts
        if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
          const alertId = `deadline-${goal.id}-${daysUntilDeadline}`
          if (!alerts.some(a => a.id === alertId)) {
            newAlerts.push({
              id: alertId,
              type: 'deadline-approaching',
              goalId: goal.id,
              message: `Goal "${goal.title}" deadline in ${daysUntilDeadline} days (${goal.progress}% complete)`,
              severity: daysUntilDeadline <= 3 ? 'critical' : 'high',
              createdAt: now.toISOString(),
              acknowledged: false
            })
          }
        }

        // Behind schedule alerts
        if (daysUntilDeadline > 0) {
          const expectedProgress = Math.max(0, 100 - (daysUntilDeadline / 30 * 100))
          if (goal.progress < expectedProgress - 20) {
            const alertId = `behind-${goal.id}-${Math.floor(expectedProgress)}`
            if (!alerts.some(a => a.id === alertId)) {
              newAlerts.push({
                id: alertId,
                type: 'behind-schedule',
                goalId: goal.id,
                message: `Goal "${goal.title}" is behind schedule (${goal.progress}% vs expected ${Math.round(expectedProgress)}%)`,
                severity: 'medium',
                createdAt: now.toISOString(),
                acknowledged: false
              })
            }
          }
        }

        // Milestone missed alerts (from milestones if they exist)
        if (goal.milestones) {
          goal.milestones.forEach(milestone => {
            if (!milestone.completed && new Date(milestone.targetDate) < now) {
              const alertId = `milestone-${goal.id}-${milestone.id}`
              if (!alerts.some(a => a.id === alertId)) {
                newAlerts.push({
                  id: alertId,
                  type: 'milestone-missed',
                  goalId: goal.id,
                  message: `Milestone "${milestone.title}" in goal "${goal.title}" is overdue`,
                  severity: 'high',
                  createdAt: now.toISOString(),
                  acknowledged: false
                })
              }
            }
          })
        }
      }

      // Goal completion alerts
      if (goal.status === 'completed') {
        const alertId = `completed-${goal.id}`
        if (!alerts.some(a => a.id === alertId)) {
          newAlerts.push({
            id: alertId,
            type: 'goal-completed',
            goalId: goal.id,
            message: `Congratulations! Goal "${goal.title}" has been completed`,
            severity: 'low',
            createdAt: now.toISOString(),
            acknowledged: false
          })
        }
      }
    })

    if (newAlerts.length > 0) {
      setAlerts(currentAlerts => [...currentAlerts, ...newAlerts].slice(-50)) // Keep last 50 alerts
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(currentAlerts => 
      currentAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    )
  }

  const clearAllAlerts = () => {
    setAlerts(currentAlerts => 
      currentAlerts.map(alert => ({ ...alert, acknowledged: true }))
    )
  }

  const getActiveAlerts = () => {
    return alerts.filter(alert => !alert.acknowledged)
  }

  const getAlertsByType = (type: ProgressAlert['type']) => {
    return alerts.filter(alert => alert.type === type && !alert.acknowledged)
  }

  const getAlertsBySeverity = (severity: ProgressAlert['severity']) => {
    return alerts.filter(alert => alert.severity === severity && !alert.acknowledged)
  }

  // Calculate compliance score based on various factors
  const calculateComplianceScore = () => {
    if (goals.length === 0) return 0

    const progressWeight = 0.4
    const timelinessWeight = 0.3
    const completionWeight = 0.3

    const avgProgress = progressMetrics.averageProgress
    const timelinessScore = Math.max(0, 100 - (progressMetrics.overdueGoals / progressMetrics.totalGoals) * 100)
    const completionScore = (progressMetrics.completedGoals / progressMetrics.totalGoals) * 100

    return Math.round(
      (avgProgress * progressWeight) +
      (timelinessScore * timelinessWeight) +
      (completionScore * completionWeight)
    )
  }

  return {
    progressMetrics,
    alerts: getActiveAlerts(),
    isMonitoring,
    acknowledgeAlert,
    clearAllAlerts,
    getAlertsByType,
    getAlertsBySeverity,
    complianceScore: calculateComplianceScore(),
    trendsData: progressMetrics.trendsData
  }
}