import React, { useState } from 'react';
import { Search as SearchIcon, Mail, Bell } from 'lucide-react';

const Navbar = ({ pageTitle }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="p-4">
                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between">
                    <div className="flex items-center ml-2">
                        <h1 className="text-xl font-semibold text-[#2CC297]">{pageTitle}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Ikon Pencarian */}
                        <div className="relative w-64">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                className="pl-10 w-full px-3 py-2 border rounded"
                                placeholder="Search..."
                                type="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                aria-label="Search"
                            />
                        </div>

                        <button className="p-2 hover:bg-gray-100 rounded" aria-label="Mail">
                            <Mail className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded" aria-label="Notifications">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm font-medium">Ahmad Mulyono</div>
                                <div className="text-xs text-gray-500">Admin</div>
                            </div>
                            <img
                                src="/placeholder.svg"
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/placeholder.svg"
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="text-left hidden sm:block">
                                <div className="text-sm font-medium">Ahmad Mulyono</div>
                                <div className="text-xs text-gray-500">Admin</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded" aria-label="Mail">
                                <Mail className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded" aria-label="Notifications">
                                <Bell className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Ikon Pencarian untuk Mobile */}
                    <div className="relative w-full">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            className="pl-10 w-full px-3 py-2 border rounded"
                            placeholder="Search..."
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            aria-label="Search"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
