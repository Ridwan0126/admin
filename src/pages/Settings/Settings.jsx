import React, { useState, useEffect, useRef } from "react";
import { useUser } from '@/component/layout/UserContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import Swal from 'sweetalert2';
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

const Settings = () => {
  const { fetchUserProfile, setUserProfile, userProfile } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    role: '',
    address: '',
    profileImage: '/Avatar.svg' 
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
        console.log("Data userProfile di frontend:", userProfile); 
        setProfileData({
            ...userProfile,
            profileImage: userProfile.profileImage || '/Avatar.svg' 
        });
    }
}, [userProfile]);
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedProfileData = {
        ...profileData,
        gender: profileData.gender
    };

    try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProfileData),
        });

        if (response.ok) {
            const updatedData = await response.json();
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: 'Data berhasil diupdate.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            });

            const newProfileData = {
                ...updatedData,
                gender: updatedData.gender === 'Perempuan' ? 'female' : 'male'
            };
            setProfileData(newProfileData);
            setUserProfile(newProfileData);
            localStorage.setItem('userProfile', JSON.stringify(newProfileData)); 

            setIsEditDialogOpen(false);
        } else {
            alert('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
};

const handleImageChange = async (e) => {
  const file = e.target.files?.[0];
  if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
          const response = await fetch('http://localhost:5000/api/user/profile/upload', {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: formData,  
          });

          if (response.ok) {
              const data = await response.json();
              alert('Profile image uploaded successfully!');
              setUserProfile((prev) => ({
                  ...prev,
                  profileImage: data.profileImage,  
              }));
          } else {
              alert('Failed to upload profile image');
          }
      } catch (error) {
          console.error('Error uploading profile image:', error);
      }
  }
};

const handleDeleteImage = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/user/profile/image', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (response.ok) {
      alert('Profile image deleted successfully');

      setProfileData((prev) => ({
        ...prev,
        profileImage: '/Avatar.svg'
      }));
      setUserProfile((prev) => ({
        ...prev,
        profileImage: '/Avatar.svg'
      }));
      localStorage.setItem('userProfile', JSON.stringify({ ...profileData, profileImage: '/Avatar.svg' }));
    } else {
      throw new Error('Failed to delete profile image');
    }
  } catch (error) {
    console.error('Error deleting profile image:', error);
  }
};

  const renderEditDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={profileData.firstName || ""}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={profileData.lastName || ""}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              value={profileData.gender || "female"}
              onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Perempuan</SelectItem>
                <SelectItem value="male">Laki-laki</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              value={profileData.role}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              name="address"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              rows={3}
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              Batal
            </Button>
            <Button type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-customTeal text-white rounded-md hover:bg-customTeal transition-colors duration-200"
            >
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Profile picture</h2>
              <Button 
                className="mr-2 bg-[#55B3A4] text-[#ffffff] border-[#55B3A4] hover:bg-[#55B3A4]"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Edit
              </Button>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-24 h-24">
              <AvatarImage src={`http://localhost:5000${profileData.profileImage}`} alt="Profile picture" />
                <AvatarFallback>
                  {profileData.firstName?.[0] || ''}{profileData.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  className="bg-[#55B3A4] text-[#ffffff] border-[#55B3A4] hover:bg-[#55B3A4]/10 w-36 h-10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change picture
                </Button>
                <Button
                  variant="outline"
                  className="text-[#F64A4A] border-[#F64A4A] hover:bg-[#F64A4A]/10 w-36 h-10"
                  onClick={handleDeleteImage}
                >
                  Delete picture
                </Button>
              </div>

              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <Input 
                  value={profileData.firstName} 
                  className="w-full bg-gray-50" 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <Input 
                  value={profileData.lastName} 
                  className="w-full bg-gray-50" 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  value={profileData.email}
                  className="w-full bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <Input 
                  value={profileData.phone} 
                  className="w-full bg-gray-50" 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Input 
                  value={profileData.gender === 'female' ? 'Perempuan' : 'Laki-laki'} 
                  className="w-full bg-gray-50" 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Input 
                  value={profileData.role} 
                  className="w-full bg-gray-50" 
                  disabled 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={profileData.address}
                  rows={3}
                  className="w-full border rounded-md p-2 text-sm bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {renderEditDialog()}
    </>
  );
};

export default Settings;