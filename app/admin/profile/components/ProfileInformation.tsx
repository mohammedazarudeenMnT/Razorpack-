"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save, Phone, Mail, Camera, Loader2, User, MapPin } from "lucide-react";
import axios from "axios";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  role: string;
}

export default function ProfileInformation() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    avatar: "",
    role: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          toast({
            title: "Error",
            description: "Authentication token not found",
            variant: "destructive",
          });
          return;
        }

        const response = await axios.get("/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfileData(response.data.admin);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleProfileSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("admin_token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("phone", profileData.phone || "");
      formData.append("location", profileData.location || "");

      const response = await axios.put("/api/admin/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        window.dispatchEvent(new CustomEvent("adminProfileUpdated"));
        toast({
          title: "Success",
          description: "Your profile has been updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("phone", profileData.phone || "");
      formData.append("location", profileData.location || "");

      const response = await axios.put("/api/admin/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setProfileData(response.data.admin);
        window.dispatchEvent(new CustomEvent("adminProfileUpdated"));
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to upload avatar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileData.avatar} alt="Profile picture" />
            <AvatarFallback className="bg-[#221E1F] text-white text-xl font-semibold">
              {profileData.firstName && profileData.lastName
                ? `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase()
                : "BF"}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2">
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-[#26A8E0] hover:bg-[#1a8abf]"
              type="button"
              asChild
            >
              <span>
                <Camera className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {profileData.firstName} {profileData.lastName}
          </h3>
          <p className="text-gray-600">{profileData.role}</p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-[#221E1F] flex items-center gap-2">
          <User className="h-5 w-5 text-[#26A8E0]" />
          Personal Information
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="text-base font-semibold">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-base font-semibold">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
              className="mt-2"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
              className="mt-2 bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <Label
              htmlFor="phone"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              value={profileData.phone}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                setProfileData({ ...profileData, phone: numericValue });
              }}
              className="mt-2"
              placeholder="+91 9994162996"
            />
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="location"
              className="text-base font-semibold flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              value={profileData.location}
              onChange={(e) =>
                setProfileData({ ...profileData, location: e.target.value })
              }
              className="mt-2"
              placeholder="Chennai, Tamil Nadu, India"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleProfileSave}
          className="bg-[#221E1F] hover:bg-[#333] text-white"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile Changes
            </>
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#221E1F]" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      )}
    </div>
  );
}
