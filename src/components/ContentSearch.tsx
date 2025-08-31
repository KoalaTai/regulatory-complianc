import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Search, BookOpen, FileText, ChevronRight, ExternalLink } from '@phosphor-icons/react'
import { regulatoryStandards, type RegulatoryStandard, type StandardSection } from '@/data/regulatoryStandards'

interface SearchResult {
  standard: RegulatoryStandard
  section?: StandardSection
  matchType: 'standard' | 'section' | 'requirement'
  matchText: string
  context: string
}

interface ContentSearchProps {
  isOpen: boolean
  onClose: () => void
  onStandardSelect: (standard: RegulatoryStandard, section?: StandardSection) => void
}

export function ContentSearch({ isOpen, onClose, onStandardSelect }: ContentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 3) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    regulatoryStandards.forEach(standard => {
      // Search in standard metadata
      const standardMatches = [
        standard.name.toLowerCase().includes(query),
        standard.fullName.toLowerCase().includes(query),
        standard.description.toLowerCase().includes(query),
        standard.searchableContent?.some(content => content.toLowerCase().includes(query)),
        standard.keyPoints?.some(point => point.toLowerCase().includes(query)),
        standard.tags?.some(tag => tag.toLowerCase().includes(query))
      ]

      if (standardMatches.some(Boolean)) {
        results.push({
          standard,
          matchType: 'standard',
          matchText: standard.name,
          context: standard.description.substring(0, 100) + '...'
        })
      }

      // Search in sections
      standard.sections_detail?.forEach(section => {
        const sectionMatches = [
          section.title.toLowerCase().includes(query),
          section.content.toLowerCase().includes(query),
          section.searchableContent?.some(content => content.toLowerCase().includes(query)),
          section.keyTerms?.some(term => term.toLowerCase().includes(query))
        ]

        if (sectionMatches.some(Boolean)) {
          results.push({
            standard,
            section,
            matchType: 'section',
            matchText: `§${section.number} - ${section.title}`,
            context: section.content.substring(0, 150) + '...'
          })
        }

        // Search in requirements
        section.requirements.forEach((requirement, index) => {
          if (requirement.toLowerCase().includes(query)) {
            results.push({
              standard,
              section,
              matchType: 'requirement',
              matchText: requirement,
              context: `Requirement under §${section.number} - ${section.title}`
            })
          }
        })
      })
    })

    return results.slice(0, 20) // Limit to 20 results
  }, [searchQuery])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setIsSearching(value.length >= 3)
  }

  const handleResultClick = (result: SearchResult) => {
    onStandardSelect(result.standard, result.section)
    onClose()
  }

  const getMatchIcon = (matchType: string) => {
    switch (matchType) {
      case 'standard': return <BookOpen className="h-4 w-4 text-primary" />
      case 'section': return <FileText className="h-4 w-4 text-secondary" />
      case 'requirement': return <ChevronRight className="h-4 w-4 text-accent" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getMatchBadge = (matchType: string) => {
    switch (matchType) {
      case 'standard': return <Badge variant="default" className="text-xs">Standard</Badge>
      case 'section': return <Badge variant="secondary" className="text-xs">Section</Badge>
      case 'requirement': return <Badge variant="outline" className="text-xs">Requirement</Badge>
      default: return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16">
      <Card className="w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Search</CardTitle>
              <CardDescription>Search across all regulatory standards, sections, and requirements</CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for specific requirements, sections, or compliance topics..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Type at least 3 characters to search
            </p>
          )}

          {isSearching && searchResults.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">Try different keywords or check spelling</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found {searchResults.length} results
                  </p>
                </div>
                
                {searchResults.map((result, index) => (
                  <Card 
                    key={`${result.standard.id}-${result.section?.id || 'standard'}-${index}`}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleResultClick(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getMatchIcon(result.matchType)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-sm">{result.matchText}</h4>
                            {getMatchBadge(result.matchType)}
                            <Badge variant="outline" className="text-xs">
                              {result.standard.name}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {result.context}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{result.standard.region}</span>
                            <span>•</span>
                            <span>{result.standard.category}</span>
                            {result.standard.officialUrl && (
                              <>
                                <span>•</span>
                                <ExternalLink className="h-3 w-3" />
                                <span>Official Source</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          <Separator />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Search covers {regulatoryStandards.length} standards across all regions</span>
            <span>Press Esc to close</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for keyboard shortcuts
export function useContentSearch() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen(true)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { isOpen, setIsOpen }
}