import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Search, BookOpen, Globe, Flag, Calendar, ExternalLink, Bookmark } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface RegulatoryStandard {
  id: string
  name: string
  description: string
  region: string
  category: string
  effectiveDate: string
  lastUpdated: string
  sections: Array<{
    id: string
    title: string
    description: string
    content: string
  }>
}

export function StandardsBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedStandard, setSelectedStandard] = useState<RegulatoryStandard | null>(null)
  const [bookmarkedStandards, setBookmarkedStandards] = useKV<string[]>('bookmarked-standards', [])

  // Mock regulatory standards data
  const regulatoryStandards: RegulatoryStandard[] = [
    {
      id: 'fda-qsr-820',
      name: 'FDA 21 CFR Part 820 - Quality System Regulation',
      description: 'Current Good Manufacturing Practice (cGMP) for Medical Devices',
      region: 'United States',
      category: 'Medical Devices',
      effectiveDate: '1996-06-01',
      lastUpdated: '2023-08-15',
      sections: [
        {
          id: '820.30',
          title: 'Design Controls',
          description: 'Requirements for design controls in medical device manufacturing',
          content: 'Each manufacturer of any class II or class III device shall establish and maintain procedures to control the design of the device in order to ensure that specified design requirements are met.'
        },
        {
          id: '820.40',
          title: 'Document Controls',
          description: 'Requirements for controlling documents and data',
          content: 'Each manufacturer shall establish and maintain procedures to control all documents that are required by this part or that are used by or otherwise impact the quality system.'
        },
        {
          id: '820.50',
          title: 'Purchasing Controls',
          description: 'Controls over suppliers and purchased products',
          content: 'Each manufacturer shall establish and maintain procedures to ensure that all purchased or otherwise received product and services conform to specified requirements.'
        }
      ]
    },
    {
      id: 'iso-13485',
      name: 'ISO 13485:2016 - Medical Devices QMS',
      description: 'Quality management systems for medical devices regulatory purposes',
      region: 'International',
      category: 'Medical Devices',
      effectiveDate: '2016-03-01',
      lastUpdated: '2023-09-10',
      sections: [
        {
          id: '4.1',
          title: 'General Requirements',
          description: 'General quality management system requirements',
          content: 'The organization shall establish, document, implement, and maintain a quality management system and continually improve its effectiveness.'
        },
        {
          id: '7.3',
          title: 'Design and Development',
          description: 'Design and development process requirements',
          content: 'The organization shall plan and control the design and development of the medical device.'
        }
      ]
    },
    {
      id: 'eu-mdr-2017',
      name: 'EU MDR 2017/745 - Medical Device Regulation',
      description: 'European regulation on medical devices',
      region: 'European Union',
      category: 'Medical Devices',
      effectiveDate: '2021-05-26',
      lastUpdated: '2023-07-20',
      sections: [
        {
          id: 'article-10',
          title: 'Article 10 - Classification Rules',
          description: 'Rules for classification of medical devices',
          content: 'Medical devices shall be classified in accordance with the classification rules set out in Annex VIII.'
        },
        {
          id: 'article-61',
          title: 'Article 61 - Clinical Evaluation',
          description: 'Requirements for clinical evaluation of medical devices',
          content: 'Clinical evaluation shall be performed for all devices except for class I non-sterile, non-measuring devices.'
        }
      ]
    },
    {
      id: 'iso-14971',
      name: 'ISO 14971:2019 - Risk Management',
      description: 'Application of risk management to medical devices',
      region: 'International',
      category: 'Risk Management',
      effectiveDate: '2019-12-01',
      lastUpdated: '2023-06-05',
      sections: [
        {
          id: '4.1',
          title: 'Risk Management Process',
          description: 'General requirements for risk management process',
          content: 'The manufacturer shall establish, document and maintain throughout the life cycle a risk management process.'
        },
        {
          id: '5.2',
          title: 'Risk Analysis',
          description: 'Systematic use of available information to identify hazards and estimate risk',
          content: 'For each identified hazardous situation, the manufacturer shall estimate the associated risk(s).'
        }
      ]
    }
  ]

  const categories = ['all', 'Medical Devices', 'Risk Management', 'Quality Systems']
  const regions = ['all', 'United States', 'European Union', 'International']

  const filteredStandards = regulatoryStandards.filter(standard => {
    const matchesSearch = searchQuery === '' || 
      standard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.sections.some(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    const matchesCategory = selectedCategory === 'all' || standard.category === selectedCategory
    const matchesRegion = selectedRegion === 'all' || standard.region === selectedRegion
    
    return matchesSearch && matchesCategory && matchesRegion
  })

  const toggleBookmark = (standardId: string) => {
    setBookmarkedStandards(current => 
      current.includes(standardId)
        ? current.filter(id => id !== standardId)
        : [...current, standardId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Regulatory Standards Browser</h2>
        <p className="text-muted-foreground">Browse and search comprehensive regulatory standards database</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search standards, sections, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <div className="flex flex-wrap gap-2">
                  {regions.map(region => (
                    <Button
                      key={region}
                      variant={selectedRegion === region ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRegion(region)}
                    >
                      {region === 'all' ? 'All Regions' : region}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Standards ({filteredStandards.length})</h3>
          </div>
          
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredStandards.map(standard => (
                <Card 
                  key={standard.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedStandard?.id === standard.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedStandard(standard)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm leading-tight">{standard.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{standard.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(standard.id)
                          }}
                          className="ml-2 flex-shrink-0"
                        >
                          <Bookmark className={`h-4 w-4 ${
                            bookmarkedStandards.includes(standard.id) ? 'fill-current text-yellow-500' : ''
                          }`} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {standard.region}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Flag className="w-3 h-3 mr-1" />
                          {standard.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          Updated {new Date(standard.lastUpdated).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{standard.sections.length} sections</span>
                        <span>Effective: {new Date(standard.effectiveDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Standard Details */}
        <div>
          {selectedStandard ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedStandard.name}</CardTitle>
                    <CardDescription>{selectedStandard.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Text
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Region:</span>
                      <p>{selectedStandard.region}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Category:</span>
                      <p>{selectedStandard.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Effective Date:</span>
                      <p>{new Date(selectedStandard.effectiveDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Last Updated:</span>
                      <p>{new Date(selectedStandard.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Key Sections</h4>
                    <Accordion type="single" collapsible className="space-y-2">
                      {selectedStandard.sections.map(section => (
                        <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-sm font-medium hover:no-underline">
                            {section.id}: {section.title}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm">
                            <div className="space-y-2 pt-2">
                              <p className="text-muted-foreground">{section.description}</p>
                              <p>{section.content}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Standard</h3>
                <p className="text-muted-foreground">Choose a regulatory standard from the list to view its details and sections.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}