import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: {
    firstName: string
    lastName: string
    email: string
    address: string
    phone: string
    role: string
  }
  onSubmit: (data: any) => void
}

export default function EditProfileModal({ 
  open, 
  onOpenChange, 
  defaultValues = {
    firstName: 'Ahmad',
    lastName: 'Mulyono',
    email: 'mulyonognwn@gmail.com',
    address: 'Batam, Kepulauan Riau',
    phone: '085712345678',
    role: 'Admin'
  },
  onSubmit 
}: EditProfileModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    onSubmit(Object.fromEntries(formData))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-4">
            <Label htmlFor="nama">Nama</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                id="firstName"
                name="firstName"
                defaultValue={defaultValues.firstName}
                className="col-span-1"
                placeholder="First name"
              />
              <Input
                id="lastName"
                name="lastName"
                defaultValue={defaultValues.lastName}
                className="col-span-1"
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={defaultValues.email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={defaultValues.address}
              className="resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor telepon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={defaultValues.phone}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              defaultValue={defaultValues.role}
              readOnly
            />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}