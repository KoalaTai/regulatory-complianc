import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  BookOpen, 
  Save,
  X,
  CheckCircle,
  Mail,
  Globe
} from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'

interface UserSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Form states
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '')
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userProfile?.preferences.notificationsEnabled ?? true
  )
  const [primaryStandards, setPrimaryStandards] = useState(
    userProfile?.preferences.primaryStandards || []
  )
  const [theme, setTheme] = useState(userProfile?.preferences.theme || 'professional')

  if (!isOpen || !user || !userProfile) return null

  const availableStandards = [
    { id: 'FDA_QSR', name: 'FDA 21 CFR Part 820', region: 'US' },
    { id: 'ISO_13485', name: 'ISO 13485:2016', region: 'International' },
    { id: 'EU_MDR', name: 'EU MDR 2017/745', region: 'EU' },
    { id: 'ISO_14971', name: 'ISO 14971:2019', region: 'International' },
    { id: 'ISO_27001', name: 'ISO 27001:2013', region: 'International' },
    { id: 'FDA_CFR_211', name: 'FDA 21 CFR Part 211', region: 'US' }
  ]

  const themeOptions = [
    { value: 'professional', label: 'Professional', description: 'Clean, business-focused design' },
    { value: 'minimal', label: 'Minimal', description: 'Simplified interface with less visual elements' },
    { value: 'compact', label: 'Compact', description: 'Dense layout for power users' }
  ]

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      await updateUserProfile({
        displayName,
        preferences: {
          notificationsEnabled,
          primaryStandards,
          theme
        }
      })
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
    
    setLoading(false)
  }

  const toggleStandard = (standardId: string) => {
    setPrimaryStandards(prev => 
      prev.includes(standardId)
        ? prev.filter(id => id !== standardId)
        : [...prev, standardId]
    )
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] mx-4 border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and personalization
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            <div className="p-6 pt-0">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="preferences">Standards</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src={user.photoURL || ''} alt={userProfile.displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                        {getInitials(displayName || user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{displayName || 'Anonymous User'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified Account
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                        <Badge variant="outline" className="ml-auto text-xs">Verified</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {userProfile.stats.auditSimulationsCompleted}
                        </p>
                        <p className="text-xs text-muted-foreground">Audits Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {userProfile.stats.citationsManaged}
                        </p>
                        <p className="text-xs text-muted-foreground">Citations Managed</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Standards Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Primary Standards</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the regulatory standards you work with most frequently for personalized content and suggestions.
                    </p>

                    <div className="space-y-3">
                      {availableStandards.map((standard) => (
                        <div 
                          key={standard.id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/30 ${
                            primaryStandards.includes(standard.id) ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => toggleStandard(standard.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                              primaryStandards.includes(standard.id) 
                                ? 'border-primary bg-primary' 
                                : 'border-muted-foreground'
                            }`}>
                              {primaryStandards.includes(standard.id) && (
                                <CheckCircle className="w-4 h-4 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{standard.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              {standard.region}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {primaryStandards.length > 0 && (
                      <div className="mt-4 p-3 border rounded-lg bg-secondary/10">
                        <p className="text-sm font-medium text-secondary">
                          {primaryStandards.length} standards selected
                        </p>
                        <p className="text-xs text-muted-foreground">
                          These standards will be prioritized in your dashboard and AI recommendations.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Control how you receive updates about regulatory changes and platform features.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">General Notifications</Label>
                          <p className="text-xs text-muted-foreground">
                            Receive updates about new features and platform improvements
                          </p>
                        </div>
                        <Switch
                          checked={notificationsEnabled}
                          onCheckedChange={setNotificationsEnabled}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Regulatory Updates</Label>
                          <p className="text-xs text-muted-foreground">
                            Get notified about changes to your primary standards
                          </p>
                        </div>
                        <Switch checked={true} disabled />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">AI Insights</Label>
                          <p className="text-xs text-muted-foreground">
                            Receive personalized compliance recommendations
                          </p>
                        </div>
                        <Switch checked={notificationsEnabled} disabled />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Interface Theme</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose your preferred interface style for the best experience.
                    </p>

                    <div className="space-y-3">
                      {themeOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/30 ${
                            theme === option.value ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setTheme(option.value)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                              theme === option.value 
                                ? 'border-primary bg-primary' 
                                : 'border-muted-foreground'
                            }`}>
                              {theme === option.value && (
                                <div className="w-2 h-2 rounded-full bg-primary-foreground mx-auto mt-0.5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{option.label}</p>
                              <p className="text-xs text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t bg-muted/20">
            {success && (
              <div className="flex items-center gap-2 text-secondary">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Settings saved successfully!</span>
              </div>
            )}
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}