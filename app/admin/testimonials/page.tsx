"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useServices } from "@/hooks/use-services"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  User,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Star,
  Quote,
  Loader2,
  Search,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Testimonial {
  _id?: string
  name: string
  location: string
  avatar: string
  content: string
  rating: number
  serviceType: string
  date: string
  status: string
}

export default function TestimonialsPage() {
  const { toast } = useToast()
  const { services } = useServices()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [statsData, setStatsData] = useState({
    total: 0,
    published: 0,
    draft: 0
  })
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    content: "",
    rating: 5,
    avatar: "",
    status: "published",
    date: new Date().toISOString().split("T")[0],
    serviceType: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchTestimonials(currentPage)
  }, [currentPage, searchTerm, statusFilter])

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true)
      const url = new URL('/api/admin/testimonial', window.location.origin)
      url.searchParams.append('page', page.toString())
      url.searchParams.append('limit', '10')
      if (statusFilter !== "all") url.searchParams.append('status', statusFilter)
      if (searchTerm) url.searchParams.append('search', searchTerm)

      const response = await fetch(url)
      const result = await response.json()
      if (result.success) {
        setTestimonials(result.data)
        if (result.pagination) {
          setPagination(result.pagination)
        }
        if (result.stats) {
          setStatsData(result.stats)
        }
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial._id || null)
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar,
      status: testimonial.status,
      date: new Date(testimonial.date).toISOString().split("T")[0],
      serviceType: testimonial.serviceType,
    })
    setPreviewUrl(testimonial.avatar)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      name: "",
      location: "",
      content: "",
      rating: 5,
      avatar: "",
      status: "published",
      date: new Date().toISOString().split("T")[0],
      serviceType: "",
    })
    setSelectedFile(null)
    setPreviewUrl("")
    setIsFormSubmitted(false)
  }

  const handleSave = async () => {
    setIsFormSubmitted(true)
    if (!formData.name || !formData.location || !formData.content || !formData.serviceType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const apiFormData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'avatar') {
          apiFormData.append(key, value.toString())
        }
      })
      
      if (selectedFile) {
        apiFormData.append('avatar', selectedFile)
      } else if (formData.avatar) {
        apiFormData.append('avatar', formData.avatar)
      }

      const url = editingId ? `/api/admin/testimonial/${editingId}` : '/api/admin/testimonial'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: apiFormData,
      })

      const result = await response.json()
      if (result.success) {
        fetchTestimonials()
        handleCancel()
        toast({
          title: editingId ? "Testimonial Updated" : "Testimonial Added",
          description: "Testimonial has been saved successfully.",
        })
      } else {
        throw new Error(result.message || 'Failed to save testimonial')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save testimonial",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!testimonialToDelete?._id) return

    try {
      const response = await fetch(`/api/admin/testimonial/${testimonialToDelete._id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        fetchTestimonials()
        toast({
          title: "Deleted",
          description: "Testimonial deleted successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      })
    } finally {
      setIsDeleteModalOpen(false)
      setTestimonialToDelete(null)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-200"}`}
      />
    ))
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const renderPaginationItems = () => {
    const items = []
    const { totalPages } = pagination

    // Previous
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => handlePageChange(currentPage - 1)}
          className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    )

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={`cursor-pointer ${currentPage === i ? "bg-[#221E1F] text-white hover:bg-[#333] hover:text-white border-0" : ""}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    // Next
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => handlePageChange(currentPage + 1)}
          className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    )

    return items
  }

  const stats = [
    { title: "Total Testimonials", value: statsData.total, icon: Quote, color: "text-[#221E1F]" },
    { title: "Published", value: statsData.published, icon: Star, color: "text-[#26A8E0]" },
    { title: "Draft", value: statsData.draft, icon: Edit, color: "text-[#221E1F]" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#221E1F]">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage client feedback and success stories</p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-[#26A8E0] hover:bg-[#e67a1c] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1 text-[#1E3A5F]">{stat.value}</h3>
                </div>
                <div className={`${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, location or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#221E1F]/10 to-[#26A8E0]/10 p-4 border-b">
          <CardTitle className="flex items-center gap-2 text-[#221E1F]">
            <Quote className="h-5 w-5 text-[#26A8E0]" />
            Testimonials List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-[#1E3A5F]">Client</TableHead>
                  <TableHead className="font-semibold text-[#1E3A5F]">Service</TableHead>
                  <TableHead className="font-semibold text-[#1E3A5F]">Rating</TableHead>
                  <TableHead className="font-semibold text-[#1E3A5F]">Status</TableHead>
                  <TableHead className="font-semibold text-[#1E3A5F]">Date</TableHead>
                  <TableHead className="text-right font-semibold text-[#1E3A5F]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#26A8E0] mx-auto mb-2" />
                      <p className="text-gray-500">Loading testimonials...</p>
                    </TableCell>
                  </TableRow>
                ) : testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-gray-500">
                      No testimonials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((testimonial) => (
                    <TableRow key={testimonial._id} className="hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                            {testimonial.avatar ? (
                              <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-[#1E3A5F] text-white font-bold text-sm">
                                {testimonial.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-[#1E3A5F]">{testimonial.name}</span>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {testimonial.location}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm py-4">{testimonial.serviceType}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={testimonial.status === 'published' ? 'bg-green-100 text-green-700 border-0' : 'bg-gray-100 text-gray-600 border-0'}>
                          {testimonial.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 py-4">
                        {new Date(testimonial.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)} className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(testimonial)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t flex justify-center">
              <Pagination>
                <PaginationContent>
                  {renderPaginationItems()}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1E3A5F]">
              {editingId ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-300">
                    <User className="h-10 w-10" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="h-6 w-6 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label>Client Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className={isFormSubmitted && !formData.name ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location / City *</Label>
                  <Input
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Melbourne, VIC"
                    className={isFormSubmitted && !formData.location ? "border-red-500" : ""}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating *</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={val => setFormData({ ...formData, rating: parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map(r => (
                      <SelectItem key={r} value={r.toString()}>
                        {r} Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Service / Support Model *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={val => setFormData({ ...formData, serviceType: val })}
                >
                  <SelectTrigger className={isFormSubmitted && !formData.serviceType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select service or support model" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.length > 0 && (
                      <>
                        {services.map((s: any) => (
                          <SelectItem key={s._id} value={s.serviceName}>
                            {s.serviceName}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Testimonial Content *</Label>
              <Textarea
                rows={5}
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="What did the client say about our services?"
                className={isFormSubmitted && !formData.content ? "border-red-500" : ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={val => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#26A8E0] hover:bg-[#e67a1c] text-white min-w-[120px]"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the testimonial from {testimonialToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white border-none">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
