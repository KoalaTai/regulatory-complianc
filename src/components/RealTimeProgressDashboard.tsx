import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useRealTimeProgressMonitoring } from '@/hooks/useRealTimeProgressMonitoring'
import { useKV } from '@github/spark/hooks'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Activity,
  Bell,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3,
  Zap,
  Award
} from '@phosphor-icons/react'

export const RealTimeProgressDashboard = () => {
  const {
    progressMetrics,
    alerts,
    isMonitoring,
    acknowledgeAlert,
    clearAllAlerts,
    getAlertsByType,
    complianceScore,
    trendsData
  } = useRealTimeProgressMonitoring()

  const [showAllAlerts, setShowAllAlerts] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Update timestamp every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const criticalAlerts = alerts.filter(a => a.severity === 'critical')
  const highAlerts = alerts.filter(a => a.severity === 'high')

  const getProgressTrend = () => {
    if (trendsData.length < 7) return 'stable'
    
    const recentAvg = trendsData.slice(-7).reduce((acc, day) => acc + day.progress, 0) / 7
    const olderAvg = trendsData.slice(-14, -7).reduce((acc, day) => acc + day.progress, 0) / 7
    
    if (recentAvg > olderAvg + 2) return 'up'
    if (recentAvg < olderAvg - 2) return 'down'
    return 'stable'
  }

  const progressTrend = getProgressTrend()

  return (
    <div className="space-y-6">
      {/* Real-Time Status Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
                Real-Time Compliance Monitor
              </CardTitle>
              <CardDescription>
                Live tracking of compliance goals and progress • Last updated: {lastUpdate.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 animate-pulse" />
              <div className="flex-1">
                <h4 className="font-medium text-destructive mb-2">Critical Attention Required</h4>
                <div className="space-y-2">
                  {criticalAlerts.slice(0, 2).map(alert => (
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
                  {criticalAlerts.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      And {criticalAlerts.length - 2} more critical alerts...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
              <Award className={`h-5 w-5 ${complianceScore >= 80 ? 'text-secondary' : complianceScore >= 60 ? 'text-accent' : 'text-destructive'}`} />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{complianceScore}</p>
              <p className="text-lg text-muted-foreground mb-1">/100</p>
            </div>
            <Progress value={complianceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on progress, timeliness & completion
            </p>
          </CardContent>
        </Card>

        {/* Progress Trend */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Progress Trend</p>
              {progressTrend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-secondary" />
              ) : progressTrend === 'down' ? (
                <TrendingDown className="h-5 w-5 text-destructive" />
              ) : (
                <Activity className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{progressMetrics.averageProgress}%</p>
              <Badge variant={
                progressTrend === 'up' ? 'default' : 
                progressTrend === 'down' ? 'destructive' : 'secondary'
              } className="mb-1">
                {progressTrend}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              7-day average trend
            </p>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
              <Bell className={`h-5 w-5 ${alerts.length > 0 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{alerts.length}</p>
              {alerts.length > 0 && (
                <Badge variant="destructive" className="mb-1">
                  {criticalAlerts.length} critical
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        {/* This Week Activity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">This Week</p>
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{progressMetrics.sectionsCompletedThisWeek}</p>
              <p className="text-sm text-muted-foreground mb-1">sections</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {progressMetrics.goalsCompletedThisMonth} goals completed this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Progress Overview
              </CardTitle>
              <CardDescription>Current status across all compliance goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Goals Status Breakdown */}
                <div>
                  <h4 className="font-medium mb-3">Goals Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{progressMetrics.activeGoals}</div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{progressMetrics.completedGoals}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-destructive">{progressMetrics.overdueGoals}</div>
                      <div className="text-sm text-muted-foreground">Overdue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{progressMetrics.totalGoals}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Progress Distribution */}
                <div>
                  <h4 className="font-medium mb-3">Progress Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">On Track (80-100%)</span>
                        <span className="text-sm font-medium">
                          {Math.round((progressMetrics.activeGoals * 0.3))} goals
                        </span>
                      </div>
                      <Progress value={30} className="h-2 bg-secondary/20" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">In Progress (50-79%)</span>
                        <span className="text-sm font-medium">
                          {Math.round((progressMetrics.activeGoals * 0.5))} goals
                        </span>
                      </div>
                      <Progress value={50} className="h-2 bg-accent/20" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Behind Schedule (&lt;50%)</span>
                        <span className="text-sm font-medium">
                          {Math.round((progressMetrics.activeGoals * 0.2))} goals
                        </span>
                      </div>
                      <Progress value={20} className="h-2 bg-destructive/20" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Weekly Trend */}
                <div>
                  <h4 className="font-medium mb-3">7-Day Progress Trend</h4>
                  <div className="flex items-end gap-2 h-20">
                    {trendsData.slice(-7).map((day, index) => (
                      <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                        <div 
                          className="w-full bg-accent rounded-sm"
                          style={{ 
                            height: `${Math.max(4, (day.progress / 100) * 60)}px`,
                            opacity: 0.7 + (index * 0.1) 
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Activity */}
        <div className="space-y-6">
          {/* Live Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Live Alerts
                  {alerts.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {alerts.length}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllAlerts(!showAllAlerts)}
                  >
                    {showAllAlerts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {alerts.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllAlerts}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {alerts.length > 0 ? (
                  <div className="space-y-3">
                    {(showAllAlerts ? alerts : alerts.slice(0, 5)).map(alert => (
                      <div 
                        key={alert.id} 
                        className={`p-3 border rounded-md ${
                          alert.severity === 'critical' ? 'border-destructive/50 bg-destructive/5' :
                          alert.severity === 'high' ? 'border-yellow-500/50 bg-yellow-500/5' :
                          'border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              alert.severity === 'critical' ? 'bg-destructive animate-pulse' :
                              alert.severity === 'high' ? 'bg-yellow-500' :
                              alert.severity === 'medium' ? 'bg-accent' :
                              'bg-muted-foreground'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(alert.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            ✓
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!showAllAlerts && alerts.length > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setShowAllAlerts(true)}
                      >
                        Show {alerts.length - 5} more alerts...
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No active alerts</p>
                    <p className="text-xs text-muted-foreground">Your compliance is on track</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                Create New Goal
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Update Progress
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Configure Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}