import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Search, BookOpen, Globe, Users, FileText } from '@phosphor-icons/react'

export function StandardsBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const standards = [
    {
      id: 'fda-qsr',
      name: 'FDA 21 CFR Part 820',
      fullName: 'Quality System Regulation',
      region: 'United States',
      category: 'Medical Devices',
      description: 'Establishes quality system requirements for medical device manufacturers',
      sections: 25,
      lastUpdated: '2023-08-15',
      status: 'Active'
    },
    {
      id: 'iso-13485',
      name: 'ISO 13485:2016',
      fullName: 'Medical Devices - Quality Management Systems',
      region: 'International',
      category: 'Medical Devices',
      description: 'Requirements for quality management system for medical devices',
      sections: 42,
      lastUpdated: '2023-09-01',
      status: 'Active'
    },
    {
      id: 'eu-mdr',
      name: 'EU MDR 2017/745',
      fullName: 'European Medical Device Regulation',
      region: 'European Union',
      category: 'Medical Devices',
      description: 'Regulation on medical devices in the European Union',
      sections: 123,
      lastUpdated: '2023-07-20',
      status: 'Active'
    },
    {
      id: 'iso-14971',
      name: 'ISO 14971:2019',
      fullName: 'Medical Devices - Risk Management',
      region: 'International',
      category: 'Risk Management',
      description: 'Application of risk management to medical devices',
      sections: 18,
      lastUpdated: '2023-06-10',
      status: 'Active'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Standards', count: standards.length },
    { id: 'medical-devices', name: 'Medical Devices', count: 3 },
    { id: 'risk-management', name: 'Risk Management', count: 1 },
    { id: 'quality', name: 'Quality Systems', count: 2 }
  ]

  const filteredStandards = standards.filter(standard => {
    const matchesSearch = standard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         standard.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
                           standard.category.toLowerCase().includes(selectedCategory.replace('-', ' '))
    
    return matchesSearch && matchesCategory
  })

  const getRegionIcon = (region: string) => {
    switch (region) {
      case 'United States': return <span className="text-xs">🇺🇸</span>
      case 'European Union': return <span className="text-xs">🇪🇺</span>
      case 'International': return <Globe className="h-3 w-3" />
      default: return <Globe className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Standards Library</CardTitle>
          <CardDescription>Search and explore regulatory standards across regions and industries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search standards, regulations, or requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="h-8"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStandards.map((standard, index) => (
          <Card key={standard.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{standard.name}</h3>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{standard.fullName}</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getRegionIcon(standard.region)}
                  {standard.region}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{standard.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {standard.sections} sections
                  </span>
                  <span>Updated {standard.lastUpdated}</span>
                </div>
                <Badge variant={standard.status === 'Active' ? 'default' : 'secondary'}>
                  {standard.status}
                </Badge>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Standard
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Start Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStandards.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No standards found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}