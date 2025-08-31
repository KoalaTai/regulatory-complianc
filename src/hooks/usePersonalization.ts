import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'

// Hook to update user statistics when authenticated
export const useUserStats = () => {
  const { user, userProfile, updateUserProfile } = useAuth()

  const updateStats = async (statType: 'auditSimulationsCompleted' | 'citationsManaged' | 'aiConversations', increment: number = 1) => {
    if (!user || !userProfile) return

    const newStats = {
      ...userProfile.stats,
      [statType]: userProfile.stats[statType] + increment
    }

    await updateUserProfile({
      stats: newStats
    })
  }

  const incrementAuditSimulations = () => updateStats('auditSimulationsCompleted')
  const incrementCitations = () => updateStats('citationsManaged')
  const incrementAIConversations = () => updateStats('aiConversations')

  return {
    incrementAuditSimulations,
    incrementCitations,
    incrementAIConversations,
    updateStats
  }
}

// Hook to get personalized recommendations based on user preferences
export const usePersonalizedContent = () => {
  const { user, userProfile } = useAuth()

  const getPersonalizedStandards = () => {
    if (!userProfile?.preferences.primaryStandards) return []
    return userProfile.preferences.primaryStandards
  }

  const getRecommendedActions = () => {
    if (!userProfile) return []

    const recommendations = []
    
    // Recommend based on primary standards
    if (userProfile.preferences.primaryStandards.includes('FDA_QSR')) {
      recommendations.push({
        title: 'FDA QSR Audit Prep',
        description: 'Prepare for FDA 21 CFR Part 820 inspection',
        action: 'audit',
        priority: 'high'
      })
    }

    if (userProfile.preferences.primaryStandards.includes('ISO_13485')) {
      recommendations.push({
        title: 'ISO 13485 Compliance Check',
        description: 'Review design controls requirements',
        action: 'standards',
        priority: 'medium'
      })
    }

    // Recommend based on activity
    if (userProfile.stats.citationsManaged < 5) {
      recommendations.push({
        title: 'Build Citation Library',
        description: 'Add key regulatory citations for quick reference',
        action: 'citations',
        priority: 'low'
      })
    }

    return recommendations
  }

  const isFeatureRecommended = (feature: string) => {
    if (!userProfile) return false
    
    switch (feature) {
      case 'audit':
        return userProfile.preferences.primaryStandards.length > 0
      case 'citations':
        return userProfile.stats.citationsManaged < 10
      case 'ai-assistant':
        return userProfile.stats.aiConversations < 5
      default:
        return false
    }
  }

  return {
    getPersonalizedStandards,
    getRecommendedActions,
    isFeatureRecommended,
    isAuthenticated: !!user
  }
}