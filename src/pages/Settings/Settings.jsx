import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
  return (
    <>
      {/* Page Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Profile picture</h2>
              <Button className="mr-2 bg-[#4182F9] hover:bg-[#3671e0] text-white">
                Edit
              </Button>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src="/Avatar.svg?height=96&width=96"
                  alt="Profile picture"
                />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div>
                <Button
                  variant="outline"
                  className="mr-2 bg-[#55B3A4] text-[#ffffff] border-[#55B3A4] hover:bg-[#55B3A4]/10"
                >
                  Change picture
                </Button>
                <Button
                  variant="outline"
                  className="text-[#F64A4A] border-[#F64A4A] hover:bg-[#F64A4A]/10"
                >
                  Delete picture
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <Input defaultValue="Ahmad" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <Input defaultValue="Mulyono" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  defaultValue="mulyonognwn@gmail.com"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <Input defaultValue="085712345678" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Input defaultValue="Perempuan" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Input defaultValue="Admin" className="w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  defaultValue="Jl. Hang Lekiu KM 2 Nongsa Batam Indonesia."
                  rows={3}
                  className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Settings;
