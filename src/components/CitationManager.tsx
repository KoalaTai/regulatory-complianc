import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Plus, Search, Download, Upload, Copy, ExternalLink, CheckCircle, AlertCircle, Clock } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Citation {
  id: string
  title: string
  standard: string
  section: string
  type: 'regulation' | 'standard' | 'guidance' | 'article'
  date: string
  url?: string
  notes?: string
  tags: string[]
  validated: boolean
  lastChecked: Date
  createdAt: Date
}

interface CitationSuggestion {
  text: string
  suggestedCitations: Array<{
    standard: string
    section: string
    relevance: number
    context: string
  }>
}

export function CitationManager() {
  const [citations, setCitations] = useKV<Citation[]>('regulatory-citations', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [documentText, setDocumentText] = useState('')
  const [citationSuggestions, setCitationSuggestions] = useState<CitationSuggestion | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Form states for adding citations
  const [newCitation, setNewCitation] = useState({
    title: '',
    standard: '',
    section: '',
    type: 'regulation' as const,
    date: '',
    url: '',
    notes: '',
    tags: ''
  })

  const citationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'regulation', label: 'Regulations' },
    { value: 'standard', label: 'Standards' },
    { value: 'guidance', label: 'Guidance Documents' },
    { value: 'article', label: 'Articles' }
  ]

  const sampleCitations: Citation[] = [
    {
      id: '1',
      title: '21 CFR Part 820 - Quality System Regulation',
      standard: 'FDA QSR',
      section: '820.30',
      type: 'regulation',
      date: '2022-01-01',
      url: 'https://www.fda.gov/21cfr820',
      notes: 'Design control requirements for medical devices',
      tags: ['FDA', 'design-controls', 'medical-devices'],
      validated: true,
      lastChecked: new Date('2023-11-01'),
      createdAt: new Date('2023-08-15')
    },
    {
      id: '2',
      title: 'ISO 13485:2016 - Medical devices QMS',
      standard: 'ISO 13485',
      section: '7.3',
      type: 'standard',
      date: '2016-03-01',
      url: 'https://www.iso.org/standard/59752.html',
      notes: 'Design and development requirements',
      tags: ['ISO', 'QMS', 'design-development'],
      validated: true,
      lastChecked: new Date('2023-10-15'),
      createdAt: new Date('2023-09-01')
    },
    {
      id: '3',
      title: 'EU MDR 2017/745 - Medical Device Regulation',
      standard: 'EU MDR',
      section: 'Article 61',
      type: 'regulation',
      date: '2021-05-26',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R0745',
      notes: 'Clinical evaluation requirements',
      tags: ['EU', 'clinical-evaluation', 'MDR'],
      validated: false,
      lastChecked: new Date('2023-09-20'),
      createdAt: new Date('2023-10-01')
    }
  ]

  // Initialize with sample data if empty
  React.useEffect(() => {
    if (citations.length === 0) {
      setCitations(sampleCitations)
    }
  }, [citations.length, setCitations])

  const filteredCitations = citations.filter(citation => {
    const matchesSearch = searchQuery === '' || 
      citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citation.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citation.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = selectedType === 'all' || citation.type === selectedType
    
    return matchesSearch && matchesType
  })

  const addCitation = () => {
    if (!newCitation.title || !newCitation.standard || !newCitation.section) {
      toast.error('Please fill in all required fields')
      return
    }

    const citation: Citation = {
      id: Date.now().toString(),
      title: newCitation.title,
      standard: newCitation.standard,
      section: newCitation.section,
      type: newCitation.type,
      date: newCitation.date,
      url: newCitation.url,
      notes: newCitation.notes,
      tags: newCitation.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      validated: false,
      lastChecked: new Date(),
      createdAt: new Date()
    }

    setCitations(current => [...current, citation])
    setNewCitation({
      title: '',
      standard: '',
      section: '',
      type: 'regulation',
      date: '',
      url: '',
      notes: '',
      tags: ''
    })
    setIsAddDialogOpen(false)
    toast.success('Citation added successfully')
  }

  const analyzeCitations = async () => {
    if (!documentText.trim()) {
      toast.error('Please enter document text to analyze')
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const suggestions: CitationSuggestion = {
        text: documentText,
        suggestedCitations: [
          {
            standard: 'FDA 21 CFR Part 820',
            section: '820.30(f)',
            relevance: 95,
            context: 'Design verification requirements mentioned in your text'
          },
          {
            standard: 'ISO 13485:2016',
            section: '7.3.5',
            relevance: 87,
            context: 'Design verification processes align with this standard'
          },
          {
            standard: 'ISO 14971:2019',
            section: '7.4',
            relevance: 78,
            context: 'Risk control verification mentioned'
          }
        ]
      }

      setCitationSuggestions(suggestions)
      toast.success('Analysis complete - citations suggested')
    } catch (error) {
      toast.error('Failed to analyze document')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const validateCitation = async (citationId: string) => {
    setCitations(current =>
      current.map(citation =>
        citation.id === citationId
          ? { ...citation, validated: true, lastChecked: new Date() }
          : citation
      )
    )
    toast.success('Citation validated')
  }

  const copyCitation = async (citation: Citation) => {
    const citationText = `${citation.title}, ${citation.standard} ${citation.section} (${citation.date})`
    
    try {
      await navigator.clipboard.writeText(citationText)
      toast.success('Citation copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy citation')
    }
  }

  const exportCitations = () => {
    const csvContent = [
      'Title,Standard,Section,Type,Date,URL,Notes,Tags',
      ...filteredCitations.map(citation => 
        `"${citation.title}","${citation.standard}","${citation.section}","${citation.type}","${citation.date}","${citation.url || ''}","${citation.notes || ''}","${citation.tags.join('; ')}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'regulatory-citations.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Citations exported')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regulation': return '📋'
      case 'standard': return '📊'
      case 'guidance': return '📖'
      case 'article': return '📄'
      default: return '📋'
    }
  }

  const getValidationStatus = (citation: Citation) => {
    if (citation.validated) {
      return { icon: CheckCircle, color: 'text-green-600', text: 'Validated' }
    }
    
    const daysSinceCheck = Math.floor((new Date().getTime() - citation.lastChecked.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceCheck > 90) {
      return { icon: AlertCircle, color: 'text-red-600', text: 'Needs Review' }
    }
    
    return { icon: Clock, color: 'text-yellow-600', text: 'Pending' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Citation & Reference Manager</h2>
          <p className="text-muted-foreground">Manage regulatory citations and validate references</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCitations}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Citation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Citation</DialogTitle>
                <DialogDescription>Create a new regulatory reference</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newCitation.title}
                    onChange={(e) => setNewCitation(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Regulation or standard title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="standard">Standard *</Label>
                    <Input
                      id="standard"
                      value={newCitation.standard}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, standard: e.target.value }))}
                      placeholder="e.g., FDA QSR"
                    />
                  </div>
                  <div>
                    <Label htmlFor="section">Section *</Label>
                    <Input
                      id="section"
                      value={newCitation.section}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, section: e.target.value }))}
                      placeholder="e.g., 820.30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newCitation.type} onValueChange={(value: any) => setNewCitation(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regulation">Regulation</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="guidance">Guidance</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newCitation.date}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newCitation.url}
                    onChange={(e) => setNewCitation(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={newCitation.tags}
                    onChange={(e) => setNewCitation(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="FDA, design-controls, medical-devices"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newCitation.notes}
                    onChange={(e) => setNewCitation(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or context"
                    rows={3}
                  />
                </div>

                <Button onClick={addCitation} className="w-full">
                  Add Citation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citation Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Citation Analysis
            </CardTitle>
            <CardDescription>Analyze text for citation suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your document text here for AI-powered citation analysis..."
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              rows={8}
              className="resize-none"
            />
            
            <Button 
              onClick={analyzeCitations} 
              disabled={isAnalyzing || !documentText.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Citations
                </>
              )}
            </Button>

            {citationSuggestions && (
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold text-sm">Suggested Citations</h4>
                {citationSuggestions.suggestedCitations.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">
                        {suggestion.standard} {suggestion.section}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.relevance}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.context}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Citations List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search citations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {citationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Citations Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Citations ({filteredCitations.length})</h3>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredCitations.map(citation => {
                  const status = getValidationStatus(citation)
                  
                  return (
                    <Card key={citation.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{getTypeIcon(citation.type)}</span>
                                <h4 className="font-medium text-sm">{citation.title}</h4>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {citation.standard} {citation.section}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-4">
                              <div className={`flex items-center gap-1 ${status.color}`}>
                                <status.icon className="h-4 w-4" />
                                <span className="text-xs">{status.text}</span>
                              </div>
                            </div>
                          </div>

                          {citation.notes && (
                            <p className="text-sm text-muted-foreground">{citation.notes}</p>
                          )}

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {citation.type}
                            </Badge>
                            {citation.date && (
                              <Badge variant="outline" className="text-xs">
                                {new Date(citation.date).getFullYear()}
                              </Badge>
                            )}
                            {citation.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              Added {citation.createdAt.toLocaleDateString()}
                            </div>
                            
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyCitation(citation)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              {citation.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(citation.url, '_blank')}
                                  className="h-8 w-8 p-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                              {!citation.validated && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => validateCitation(citation.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}