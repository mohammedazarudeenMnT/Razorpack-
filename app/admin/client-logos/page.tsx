'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useClientLogos } from '@/hooks/use-client-logos';

interface ClientLogoForm {
  name: string;
  isActive: boolean;
  order: number;
}

export default function ClientLogosPage() {
  const { toast } = useToast();
  const { clientLogos, isLoading, error, refetch } = useClientLogos(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ClientLogoForm>({
    name: '',
    isActive: true,
    order: 0,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Image size should be less than 5MB',
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name || 'Client Logo');
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('order', formData.order.toString());

      if (imageFile) {
        formDataToSend.append('logo', imageFile);
      } else if (editingId && imagePreview) {
        formDataToSend.append('existingLogo', imagePreview);
      }

      const token = localStorage.getItem('admin_token');
      const url = editingId ? `/api/admin/client-logos/${editingId}` : '/api/admin/client-logos';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: editingId ? 'Logo Updated' : 'Logo Added',
          description: `Client logo has been successfully ${editingId ? 'updated' : 'created'}.`,
        });
        setIsDialogOpen(false);
        resetForm();
        refetch();
      } else {
        // Handle both API errors and HTTP errors
        const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
        toast({
          variant: 'destructive',
          title: 'Operation Failed',
          description: errorMessage,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Network error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (logo: any) => {
    setEditingId(logo._id);
    setFormData({
      name: logo.name,
      isActive: logo.isActive,
      order: logo.order,
    });
    setImagePreview(logo.logo);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/client-logos?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Logo Deleted',
          description: 'Client logo has been successfully deleted.',
        });
        setDeletingId(null);
        refetch();
      } else {
        const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
        toast({
          variant: 'destructive',
          title: 'Delete Failed',
          description: errorMessage,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Network error occurred. Please try again.',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      isActive: true,
      order: 0,
    });
    setImagePreview('');
    setImageFile(null);
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#221E1F]">Client Logos</h1>
          <p className="text-gray-600 mt-1">Manage client logos for the homepage marquee</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-[#221E1F] hover:bg-[#221E1F]/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Client Logo
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Client Logo' : 'Add Client Logo'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name (Optional)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter client name (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo Image *</Label>
                <div className="flex flex-col gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  )}
                  {!imagePreview && (
                    <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg bg-gray-50">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No image selected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Lower numbers appear first</p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active Status
                  </Label>
                  <p className="text-sm text-gray-500">Show this logo on the website</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || (!imageFile && !imagePreview)}
                  className="flex-1 bg-[#221E1F] hover:bg-[#221E1F]/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingId ? 'Update' : 'Create'} Logo</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#221E1F]" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Client Logos</h3>
            <p className="text-gray-600 text-center mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : clientLogos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Client Logos</h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by adding your first client logo
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Client Logos ({clientLogos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {clientLogos.map((logo) => (
                <div
                  key={logo._id}
                  className="relative border rounded-lg p-4 hover:shadow-lg transition-all"
                >
                  <div className="relative h-32 mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={logo.logo}
                      alt={logo.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{logo.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          logo.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {logo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">Order: {logo.order}</div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(logo)}
                        className="flex-1"
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(logo._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client logo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
