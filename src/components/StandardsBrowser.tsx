import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, BookOpen, Globe, Users, FileText, ExternalLink, Download, Star, Filter, Tag, Calendar, Building, Command } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { 
  comprehensiveStandardsDatabase, 
  searchStandards, 
  getStandardsByCategory,
  getStandardsByRegion,
  getRelatedStandards,
  type RegulatoryStandard,
  type StandardSection
} from '@/data/standardsDatabase'
import { ContentSearch, useContentSearch } from '@/components/ContentSearch'

export function StandardsBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStandard, setSelectedStandard] = useState<RegulatoryStandard | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useKV<string[]>('favorite-standards', [])
  
  // Content search hook
  const { isOpen: isContentSearchOpen, setIsOpen: setContentSearchOpen } = useContentSearch()

  // Get data using utility functions
  const categories = useMemo(() => {
    const cats = new Set(comprehensiveStandardsDatabase.map(std => std.category))
    return Array.from(cats)
  }, [])
  
  const regions = useMemo(() => {
    const regs = new Set(comprehensiveStandardsDatabase.map(std => std.region))
    return Array.from(regs)
  }, [])
  
  const allTags = useMemo(() => {
    const tags = new Set(comprehensiveStandardsDatabase.flatMap(std => std.tags))
    return Array.from(tags)
  }, [])

  // Filter standards based on search and filters
  const filteredStandards = useMemo(() => {
    let filtered = comprehensiveStandardsDatabase

    // Apply search
    if (searchQuery.trim()) {
      filtered = searchStandards(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(std => std.category === selectedCategory)
    }

    // Apply region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(std => std.region === selectedRegion)
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(std => 
        selectedTags.some(tag => std.tags.includes(tag))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedRegion, selectedTags])

  // Get related standards for current standard
  const relatedStandards = useMemo(() => {
    if (!selectedStandard) return []
    return getRelatedStandards(selectedStandard.id)
  }, [selectedStandard])

  const toggleFavorite = (standardId: string) => {
    setFavorites(current => {
      if (current.includes(standardId)) {
        return current.filter(id => id !== standardId)
      } else {
        return [...current, standardId]
      }
    })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(current => {
      if (current.includes(tag)) {
        return current.filter(t => t !== tag)
      } else {
        return [...current, tag]
      }
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedRegion('all')
    setSelectedTags([])
  }

  const viewStandardDetail = (standard: RegulatoryStandard, section?: StandardSection) => {
    setSelectedStandard(standard)
    setViewMode('detail')
    // If a specific section was requested, scroll to it or focus on it
    if (section) {
      // Store the section to highlight it
      setTimeout(() => {
        const element = document.getElementById(section.id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          element.classList.add('highlight-section')
          setTimeout(() => element.classList.remove('highlight-section'), 3000)
        }
      }, 100)
    }
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
              <div className="lg:col-span-2 space-y-6">
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

                {/* Related Standards */}
                {relatedStandards.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Related Standards</CardTitle>
                      <CardDescription>Standards commonly used together</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {relatedStandards.map((related) => (
                          <Card key={related.id} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => viewStandardDetail(related)}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-sm">{related.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{related.description.substring(0, 80)}...</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                  {selectedStandard.complianceLevel && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance</span>
                      <Badge variant={selectedStandard.complianceLevel === 'Mandatory' ? 'destructive' : 'secondary'}>
                        {selectedStandard.complianceLevel}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sections</span>
                    <span className="text-sm">{selectedStandard.sections.length}</span>
                  </div>
                  {selectedStandard.effectiveDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Effective Date</span>
                      <span className="text-sm">{selectedStandard.effectiveDate}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm">{selectedStandard.lastUpdated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Level</span>
                    <Badge variant={selectedStandard.riskLevel === 'high' ? 'destructive' : selectedStandard.riskLevel === 'medium' ? 'default' : 'secondary'}>
                      {selectedStandard.riskLevel}
                    </Badge>
                  </div>
                  
                  {/* Tags */}
                  {selectedStandard.tags && selectedStandard.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium mb-2 block">Tags</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedStandard.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Industry */}
                  {selectedStandard.industryFocus && selectedStandard.industryFocus.length > 0 && (
                    <div>
                      <span className="text-sm font-medium mb-2 block">Industry Focus</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedStandard.industryFocus.map((ind, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Building className="h-3 w-3 mr-1" />
                            {ind}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                {selectedStandard.sections && selectedStandard.sections.length > 0 ? (
                  <div className="space-y-6">
                    {selectedStandard.sections.map((section) => (
                      <Card 
                        key={section.id} 
                        id={section.id}
                        className="border-l-4 border-l-primary"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">§{section.id} - {section.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {section.complianceLevel}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  ~{section.estimatedHours}h
                                </Badge>
                              </div>
                            </div>
                            <Badge variant="outline">{section.id}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm leading-relaxed">{section.description}</p>
                          
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

                          <div>
                            <h4 className="font-medium text-sm mb-2">Key Points:</h4>
                            <ul className="space-y-1">
                              {section.keyPoints.map((point, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">Common Pitfalls:</h4>
                            <ul className="space-y-1">
                              {section.commonPitfalls.map((pitfall, index) => (
                                <li key={index} className="text-sm text-destructive flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                                  {pitfall}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">Audit Focus Areas:</h4>
                            <ul className="space-y-1">
                              {section.auditFocus.map((focus, index) => (
                                <li key={index} className="text-sm text-accent flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                                  {focus}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {section.relatedSections && section.relatedSections.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm mb-2">Related Sections:</h4>
                              <div className="flex flex-wrap gap-2">
                                {section.relatedSections.map((rel, index) => (
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits</CardTitle>
                  <CardDescription>Benefits of implementing this standard</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedStandard.keyBenefits && selectedStandard.keyBenefits.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStandard.keyBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-relaxed">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No key benefits listed for this standard.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Implementation Tips</CardTitle>
                  <CardDescription>Practical guidance for implementation</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedStandard.implementationTips && selectedStandard.implementationTips.length > 0 ? (
                    <div className="space-y-3">
                      {selectedStandard.implementationTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent text-accent-foreground text-sm font-medium flex items-center justify-center">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No implementation tips available for this standard.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Common Challenges</CardTitle>
                  <CardDescription>Potential obstacles and how to address them</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedStandard.commonChallenges && selectedStandard.commonChallenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStandard.commonChallenges.map((challenge, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-destructive text-destructive-foreground text-sm font-medium flex items-center justify-center">
                            !
                          </div>
                          <p className="text-sm leading-relaxed">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No common challenges listed for this standard.</p>
                  )}
                </CardContent>
              </Card>
            </div>
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
          <CardDescription>
            Search and explore {comprehensiveStandardsDatabase.length} comprehensive regulatory standards across regions and industries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search standards, regulations, requirements, or key terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setContentSearchOpen(true)}
              className="flex items-center gap-2"
            >
              <Command className="h-4 w-4" />
              Deep Search
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(selectedCategory !== 'all' || selectedRegion !== 'all' || selectedTags.length > 0) && (
                <Badge variant="secondary" className="ml-1">
                  {[
                    selectedCategory !== 'all' ? 1 : 0,
                    selectedRegion !== 'all' ? 1 : 0,
                    selectedTags.length
                  ].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Help */}
          <div className="text-xs text-muted-foreground">
            💡 Use "Deep Search" for content within standards, or press <kbd className="bg-muted px-1 rounded">Ctrl+K</kbd> for quick access
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name} ({region.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <div className="space-y-2 flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear All Filters
                  </Button>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="h-7 text-xs"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map(category => (
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

          {/* Search Results Summary */}
          {(searchQuery || selectedCategory !== 'all' || selectedRegion !== 'all' || selectedTags.length > 0) && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredStandards.length} of {regulatoryStandards.length} standards
              </span>
              {filteredStandards.length !== regulatoryStandards.length && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear search
                </Button>
              )}
            </div>
          )}
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
              
              {/* Tags */}
              {standard.tags && standard.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {standard.tags.slice(0, 4).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {standard.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{standard.tags.length - 4} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {standard.sections} sections
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated {standard.lastUpdated}
                  </span>
                  {standard.complianceLevel && (
                    <Badge 
                      variant={standard.complianceLevel === 'Mandatory' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {standard.complianceLevel}
                    </Badge>
                  )}
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
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => setContentSearchOpen(true)}>
              Try Deep Search instead
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Search Modal */}
      <ContentSearch 
        isOpen={isContentSearchOpen}
        onClose={() => setContentSearchOpen(false)}
        onStandardSelect={viewStandardDetail}
      />
    </div>
  )
}