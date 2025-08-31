import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Globe, Users, FileText, ExternalLink, Download, Star } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface StandardSection {
  id: string
  number: string
  title: string
  content: string
  requirements: string[]
  related?: string[]
}

interface RegulatoryStandard {
  id: string
  name: string
  fullName: string
  region: string
  category: string
  description: string
  sections: number
  lastUpdated: string
  status: string
  officialUrl?: string
  sections_detail?: StandardSection[]
  keyPoints?: string[]
  applicability?: string[]
}

export function StandardsBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStandard, setSelectedStandard] = useState<RegulatoryStandard | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [favorites, setFavorites] = useKV<string[]>('favorite-standards', [])

  const standards: RegulatoryStandard[] = [
    {
      id: 'fda-qsr',
      name: 'FDA 21 CFR Part 820',
      fullName: 'Quality System Regulation',
      region: 'United States',
      category: 'Medical Devices',
      description: 'Establishes quality system requirements for medical device manufacturers',
      sections: 25,
      lastUpdated: '2023-08-15',
      status: 'Active',
      officialUrl: 'https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-system-qs-regulationmedical-device-good-manufacturing-practices',
      keyPoints: [
        'Design controls for Class II and III devices',
        'Risk-based approach to quality management',
        'Document and data controls requirements',
        'Management responsibility and planning'
      ],
      applicability: ['Medical Device Manufacturers', 'Contract Manufacturers', 'Importers'],
      sections_detail: [
        {
          id: '820.30',
          number: '820.30',
          title: 'Design Controls',
          content: 'Each manufacturer of any class III or class II device, and the class I devices listed in section 820.30(a)(2), shall establish and maintain procedures to control the design of the device in order to ensure that specified design requirements are met.',
          requirements: [
            'Design and development planning',
            'Design input requirements',
            'Design output requirements',
            'Design review procedures',
            'Design verification and validation'
          ],
          related: ['820.40', '820.180']
        },
        {
          id: '820.40',
          number: '820.40',
          title: 'Document Controls',
          content: 'Each manufacturer shall establish and maintain procedures to control all documents that are required by this part or that are used by the manufacturer to ensure device quality.',
          requirements: [
            'Document approval and authorization',
            'Document distribution controls',
            'Document changes and modifications',
            'Document obsolescence management'
          ],
          related: ['820.30', '820.181']
        }
      ]
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
      status: 'Active',
      officialUrl: 'https://www.iso.org/standard/59752.html',
      keyPoints: [
        'Risk-based approach to QMS',
        'Regulatory compliance emphasis',
        'Design and development controls',
        'Post-market surveillance requirements'
      ],
      applicability: ['Medical Device Organizations', 'Regulatory Bodies', 'Notified Bodies'],
      sections_detail: [
        {
          id: '7.3',
          number: '7.3',
          title: 'Design and Development',
          content: 'The organization shall plan and control the design and development of the medical device.',
          requirements: [
            'Design and development planning',
            'Design and development inputs',
            'Design and development outputs',
            'Design and development review',
            'Design and development verification and validation'
          ],
          related: ['4.2', '8.2']
        }
      ]
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
      status: 'Active',
      officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745',
      keyPoints: [
        'Strengthened clinical evidence requirements',
        'Enhanced post-market surveillance',
        'New device classification rules',
        'Increased transparency through EUDAMED'
      ],
      applicability: ['EU Medical Device Manufacturers', 'Authorized Representatives', 'Notified Bodies']
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
      status: 'Active',
      officialUrl: 'https://www.iso.org/standard/72704.html',
      keyPoints: [
        'Risk management process throughout device lifecycle',
        'Risk analysis and evaluation',
        'Risk control measures',
        'Residual risk evaluation'
      ],
      applicability: ['Medical Device Manufacturers', 'Risk Managers', 'Quality Professionals']
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

  const toggleFavorite = (standardId: string) => {
    setFavorites(current => {
      if (current.includes(standardId)) {
        return current.filter(id => id !== standardId)
      } else {
        return [...current, standardId]
      }
    })
  }

  const viewStandardDetail = (standard: RegulatoryStandard) => {
    setSelectedStandard(standard)
    setViewMode('detail')
  }

  const backToList = () => {
    setViewMode('list')
    setSelectedStandard(null)
  }

  const getRegionIcon = (region: string) => {
    switch (region) {
      case 'United States': return <span className="text-xs">🇺🇸</span>
      case 'European Union': return <span className="text-xs">🇪🇺</span>
      case 'International': return <Globe className="h-3 w-3" />
      default: return <Globe className="h-3 w-3" />
    }
  }

  if (viewMode === 'detail' && selectedStandard) {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={backToList}>
                ← Back to Standards
              </Button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      {selectedStandard.name}
                    </CardTitle>
                    <CardDescription>{selectedStandard.fullName}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleFavorite(selectedStandard.id)}
                    >
                      <Star className={`h-4 w-4 ${favorites.includes(selectedStandard.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                    {selectedStandard.officialUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={selectedStandard.officialUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Official Source
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="requirements">Key Points</TabsTrigger>
            <TabsTrigger value="applicability">Applicability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedStandard.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Standard Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Region</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getRegionIcon(selectedStandard.region)}
                      {selectedStandard.region}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <Badge>{selectedStandard.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sections</span>
                    <span className="text-sm">{selectedStandard.sections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm">{selectedStandard.lastUpdated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={selectedStandard.status === 'Active' ? 'default' : 'secondary'}>
                      {selectedStandard.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <CardTitle>Standard Sections</CardTitle>
                <CardDescription>Detailed breakdown of regulatory requirements</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStandard.sections_detail ? (
                  <div className="space-y-6">
                    {selectedStandard.sections_detail.map((section) => (
                      <Card key={section.id} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">§{section.number} - {section.title}</CardTitle>
                            </div>
                            <Badge variant="outline">{section.number}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm leading-relaxed">{section.content}</p>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-2">Key Requirements:</h4>
                            <ul className="space-y-1">
                              {section.requirements.map((req, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {section.related && (
                            <div>
                              <h4 className="font-medium text-sm mb-2">Related Sections:</h4>
                              <div className="flex flex-wrap gap-2">
                                {section.related.map((rel, index) => (
                                  <Badge key={index} variant="secondary">§{rel}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Section details not available</h3>
                    <p className="text-muted-foreground">Detailed section information is not available for this standard yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>Key Points & Requirements</CardTitle>
                <CardDescription>Essential aspects of this standard</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStandard.keyPoints ? (
                  <div className="space-y-4">
                    {selectedStandard.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No key points available for this standard.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applicability">
            <Card>
              <CardHeader>
                <CardTitle>Applicability</CardTitle>
                <CardDescription>Who should follow this standard</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStandard.applicability ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedStandard.applicability.map((applicable, index) => (
                      <Card key={index} className="text-center p-6">
                        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h3 className="font-medium">{applicable}</h3>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Applicability information not available for this standard.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
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
                <Button size="sm" className="flex-1" onClick={() => viewStandardDetail(standard)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Standard
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toggleFavorite(standard.id)}
                >
                  <Star className={`mr-2 h-4 w-4 ${favorites.includes(standard.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {favorites.includes(standard.id) ? 'Starred' : 'Star'}
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