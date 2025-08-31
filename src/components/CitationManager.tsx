import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, Search, Edit, Trash2, Copy, ExternalLink, Tag, Calendar } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface Citation {
  id: string
  title: string
  standard: string
  section: string
  content: string
  tags: string[]
  url?: string
  dateAdded: Date
  lastModified: Date
  category: 'requirement' | 'guidance' | 'definition' | 'procedure'
}

export function CitationManager() {
  const [citations, setCitations] = useKV<Citation[]>('compliance-citations', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStandard, setSelectedStandard] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCitation, setEditingCitation] = useState<Citation | null>(null)

  // Form state for adding/editing citations
  const [formData, setFormData] = useState({
    title: '',
    standard: '',
    section: '',
    content: '',
    tags: '',
    url: '',
    category: 'requirement' as Citation['category']
  })

  const standards = [
    'FDA 21 CFR Part 820',
    'ISO 13485:2016',
    'EU MDR 2017/745',
    'ISO 14971:2019',
    'ICH Q10',
    'ISO 9001:2015'
  ]

  const categories = [
    { id: 'all', name: 'All Citations', count: citations.length },
    { id: 'requirement', name: 'Requirements', count: citations.filter(c => c.category === 'requirement').length },
    { id: 'guidance', name: 'Guidance', count: citations.filter(c => c.category === 'guidance').length },
    { id: 'definition', name: 'Definitions', count: citations.filter(c => c.category === 'definition').length },
    { id: 'procedure', name: 'Procedures', count: citations.filter(c => c.category === 'procedure').length }
  ]

  const resetForm = () => {
    setFormData({
      title: '',
      standard: '',
      section: '',
      content: '',
      tags: '',
      url: '',
      category: 'requirement'
    })
    setShowAddForm(false)
    setEditingCitation(null)
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.standard || !formData.content) return

    const citation: Citation = {
      id: editingCitation?.id || Date.now().toString(),
      title: formData.title,
      standard: formData.standard,
      section: formData.section,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      url: formData.url || undefined,
      category: formData.category,
      dateAdded: editingCitation?.dateAdded || new Date(),
      lastModified: new Date()
    }

    if (editingCitation) {
      setCitations(prev => prev.map(c => c.id === citation.id ? citation : c))
    } else {
      setCitations(prev => [...prev, citation])
    }

    resetForm()
  }

  const startEdit = (citation: Citation) => {
    setFormData({
      title: citation.title,
      standard: citation.standard,
      section: citation.section,
      content: citation.content,
      tags: citation.tags.join(', '),
      url: citation.url || '',
      category: citation.category
    })
    setEditingCitation(citation)
    setShowAddForm(true)
  }

  const deleteCitation = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id))
  }

  const copyCitation = (citation: Citation) => {
    const formatted = `${citation.title} (${citation.standard} ${citation.section})\n${citation.content}`
    navigator.clipboard.writeText(formatted)
  }

  const filteredCitations = citations.filter(citation => {
    const matchesSearch = citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         citation.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         citation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || citation.category === selectedCategory
    const matchesStandard = selectedStandard === 'all' || citation.standard === selectedStandard
    
    return matchesSearch && matchesCategory && matchesStandard
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'requirement': return 'bg-primary'
      case 'guidance': return 'bg-secondary'
      case 'definition': return 'bg-accent'
      case 'procedure': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Citation Manager</CardTitle>
              <CardDescription>Organize and manage regulatory citations and references</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Citation
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search citations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Standard Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Standard</label>
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Standards</SelectItem>
                  {standards.map(standard => (
                    <SelectItem key={standard} value={standard}>
                      {standard}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Citations List */}
        <div className="lg:col-span-3">
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingCitation ? 'Edit Citation' : 'Add New Citation'}</CardTitle>
                <CardDescription>
                  {editingCitation ? 'Update citation details' : 'Add a new regulatory citation to your library'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Citation title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Standard</label>
                    <Select value={formData.standard} onValueChange={(value) => setFormData(prev => ({ ...prev, standard: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {standards.map(standard => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Section</label>
                    <Input
                      value={formData.section}
                      onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                      placeholder="e.g., 820.30, 4.1.1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Citation['category'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="requirement">Requirement</SelectItem>
                        <SelectItem value="guidance">Guidance</SelectItem>
                        <SelectItem value="definition">Definition</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Citation content or requirement text"
                    className="min-h-24"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="design controls, validation, testing (comma separated)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Reference URL</label>
                    <Input
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit}>
                    {editingCitation ? 'Update Citation' : 'Add Citation'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Citations Library</CardTitle>
                  <CardDescription>
                    {filteredCitations.length} of {citations.length} citations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCitations.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">No citations found</h3>
                  <p className="text-muted-foreground">
                    {citations.length === 0 
                      ? 'Start building your citation library by adding your first citation'
                      : 'Try adjusting your search or filter criteria'
                    }
                  </p>
                  {citations.length === 0 && (
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Citation
                    </Button>
                  )}
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredCitations.map((citation, index) => (
                      <Card key={citation.id} className="border-l-4" style={{ borderLeftColor: `var(--color-${getCategoryColor(citation.category).split('-')[1]})` }}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <h4 className="font-medium">{citation.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">
                                    {citation.standard}
                                  </Badge>
                                  {citation.section && (
                                    <Badge variant="outline" className="text-xs">
                                      §{citation.section}
                                    </Badge>
                                  )}
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs text-white ${getCategoryColor(citation.category)}`}
                                  >
                                    {citation.category}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => copyCitation(citation)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => startEdit(citation)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteCitation(citation.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {citation.url && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={citation.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm">{citation.content}</p>
                            </div>

                            {/* Tags and Metadata */}
                            <div className="space-y-2">
                              {citation.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {citation.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Added {citation.dateAdded.toLocaleDateString()}
                                </span>
                                {citation.lastModified.getTime() !== citation.dateAdded.getTime() && (
                                  <span>Modified {citation.lastModified.toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}