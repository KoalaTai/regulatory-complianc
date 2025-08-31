import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut, Shield, Crown } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/lib/firebase'

interface UserProfileProps {
  onOpenSettings?: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenSettings }) => {
  const { user, userProfile } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  if (!user || !userProfile) return null

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    setLoggingOut(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={user.photoURL || ''} alt={userProfile.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(userProfile.displayName || user.email || 'U')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        {/* User Info Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={user.photoURL || ''} alt={userProfile.displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(userProfile.displayName || user.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {userProfile.displayName || 'Anonymous User'}
                </p>
                <Badge variant="secondary" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {userProfile.stats.auditSimulationsCompleted}
              </p>
              <p className="text-xs text-muted-foreground">Audits</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {userProfile.stats.citationsManaged}
              </p>
              <p className="text-xs text-muted-foreground">Citations</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {userProfile.stats.aiConversations}
              </p>
              <p className="text-xs text-muted-foreground">AI Chats</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-1">
          <DropdownMenuItem onClick={onOpenSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy & Security</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="cursor-pointer text-destructive focus:text-destructive"
            disabled={loggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{loggingOut ? 'Signing out...' : 'Sign out'}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Compact version for smaller spaces
export const UserProfileCompact: React.FC = () => {
  const { user, userProfile } = useAuth()

  if (!user || !userProfile) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
        <AvatarImage src={user.photoURL || ''} alt={userProfile.displayName} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
          {getInitials(userProfile.displayName || user.email || 'U')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          Welcome back, {userProfile.displayName?.split(' ')[0] || 'User'}!
        </p>
      </div>
    </div>
  )
}

// Dashboard welcome card
export const WelcomeCard: React.FC = () => {
  const { user, userProfile } = useAuth()

  if (!user || !userProfile) return null

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={user.photoURL || ''} alt={userProfile.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
              {userProfile.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold text-foreground">
                Welcome back, {userProfile.displayName?.split(' ')[0] || 'User'}!
              </h2>
              <Badge variant="secondary" className="text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Continue your regulatory compliance journey
            </p>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-medium text-foreground">
                  {userProfile.stats.auditSimulationsCompleted}
                </span>
                <span className="text-muted-foreground ml-1">audits completed</span>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  {userProfile.stats.citationsManaged}
                </span>
                <span className="text-muted-foreground ml-1">citations managed</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}