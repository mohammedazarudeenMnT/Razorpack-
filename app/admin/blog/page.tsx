"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import dynamic from "next/dynamic";
import { CategorySelector } from "@/components/ui/category-selector";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  { ssr: false }
);

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "General",
    author: "Blufacade Team",
    tags: "",
    published: true,
    featured: false,
    readTime: "5 min read",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get("/api/admin/blog?limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(response.data.blogs);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const submitFormData = new FormData();
      
      // Add all text fields
      submitFormData.append("title", formData.title.trim());
      submitFormData.append("slug", formData.slug.trim());
      submitFormData.append("excerpt", formData.excerpt.trim());
      submitFormData.append("content", formData.content);
      submitFormData.append("category", formData.category);
      submitFormData.append("author", formData.author.trim());
      submitFormData.append("readTime", formData.readTime.trim());
      submitFormData.append("published", formData.published.toString());
      submitFormData.append("featured", formData.featured.toString());
      submitFormData.append("seoTitle", formData.seoTitle.trim());
      submitFormData.append("seoDescription", formData.seoDescription.trim());
      submitFormData.append("seoKeywords", formData.seoKeywords.trim());
      
      // Add tags as JSON array
      const tagsArray = formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      submitFormData.append("tags", JSON.stringify(tagsArray));

      // Handle image upload
      if (selectedImageFile) {
        submitFormData.append("image", selectedImageFile);
      } else if (formData.image) {
        submitFormData.append("existingImage", formData.image);
      }

      if (editingBlog) {
        submitFormData.append("_id", editingBlog._id);
        await axios.put("/api/admin/blog", submitFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Blog updated successfully");
      } else {
        await axios.post("/api/admin/blog", submitFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Blog created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save blog");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      await axios.delete(`/api/admin/blog?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      author: blog.author,
      tags: blog.tags.join(", "),
      published: blog.published,
      featured: blog.featured,
      readTime: blog.readTime,
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
      seoKeywords: blog.seoKeywords || "",
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingBlog(null);
    setSelectedImageFile(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      category: "General",
      author: "Blufacade Team",
      tags: "",
      published: true,
      featured: false,
      readTime: "5 min read",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setFormData({ ...formData, image: previewUrl });
        toast.success("Image selected. Click save to upload.");
      }
    };
    input.click();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#221E1F]">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage your blog posts</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-[#221E1F] hover:bg-[#221E1F]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#26A8E0]" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {blog.featured && (
                        <Badge variant="secondary" className="bg-[#26A8E0] text-white">
                          Featured
                        </Badge>
                      )}
                      {blog.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{blog.category}</Badge>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>
                    <Badge
                      variant={blog.published ? "default" : "secondary"}
                      className={blog.published ? "bg-green-500" : ""}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {blog.views}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  placeholder="e.g., Modern Facade Design Trends 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g., modern-facade-design-trends-2025"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
                placeholder="Brief summary of the blog post (150-200 characters). This will appear in blog listings and search results."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image *</Label>
              <div className="space-y-2">
                {formData.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="image"
                    type="url"
                    value={formData.image.startsWith("blob:") ? "" : formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg or upload below"
                  />
                  <Button
                    type="button"
                    onClick={handleImageUpload}
                    variant="outline"
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter image URL or upload from your computer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <CategorySelector
                  value={formData.category}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="e.g., Blufacade Team"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="e.g., facade design, ACP cladding, construction tips, architecture"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            {/* SEO Section */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-[#221E1F]">SEO Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seoTitle: e.target.value })
                  }
                  placeholder="e.g., Top 10 Facade Design Trends for Modern Buildings | Blufacade"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500">
                  {formData.seoTitle.length}/60 characters (optimal: 50-60)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, seoDescription: e.target.value })
                  }
                  placeholder="e.g., Discover the latest facade design trends transforming modern architecture. Expert insights on ACP cladding, glass facades, and sustainable building solutions."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {formData.seoDescription.length}/160 characters (optimal: 150-160)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, seoKeywords: e.target.value })
                  }
                  placeholder="e.g., facade design, ACP cladding, structural glazing, modern architecture, building exterior"
                />
                <p className="text-xs text-gray-500">
                  Comma-separated keywords for search engines
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#221E1F] hover:bg-[#221E1F]/90">
                {editingBlog ? "Update" : "Create"} Blog Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
