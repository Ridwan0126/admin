import React, { useState, useEffect } from 'react';
import { SearchIcon, Mail, Bell, LogOut } from 'lucide-react';
import { useUser } from './UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';

const notifications = [
  { id: 1, title: "Permintaan Baru", description: "Ada 3 permintaan penjemputan sampah baru", time: "Baru saja" },
  { id: 2, title: "Pembayaran Berhasil", description: "Pembayaran untuk order #12345 telah berhasil", time: "5m yang lalu" },
  { id: 3, title: "Pengingat", description: "Jadwal penjemputan sampah untuk hari ini", time: "1h yang lalu" }
];

const Navbar = ({ pageTitle, onLogout }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedUserProfile = JSON.parse(localStorage.getItem('userProfile'));
            setUserProfile(storedUserProfile);
        };

        fetchUserProfile();
        window.addEventListener('storage', fetchUserProfile);

        return () => {
            window.removeEventListener('storage', fetchUserProfile);
        };
    }, []);

    useEffect(() => {
        const fetchMessagesForAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/message/admin/messages');
                console.log("Response from API:", response.data); 
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                } else {
                    console.warn("Data is not an array:", response.data);
                    setMessages([]); 
                }
            } catch (error) {
                console.error("Error fetching messages for admin:", error);
                setMessages([]); 
            }
        };
        fetchMessagesForAdmin();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/notifications'); 
                console.log("Response from API:", response.data);
                if (Array.isArray(response.data)) {
                    setNotifications(response.data); 
                } else {
                    console.warn("Data is not an array:", response.data);
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setNotifications([]);
            }
        };
    
        fetchNotifications();
    }, []);
    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (!userProfile) {
        return <div>Loading...</div>; 
    }

    const fullName = `${userProfile.firstName} ${userProfile.lastName}`;

    const handleMarkAsRead = async (messageId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/message/mark-as-read/${messageId}`);
            if (response.status === 200) {
                setMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message.id === messageId ? { ...message, status: 'read' } : message
                    )
                );
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const unreadMessagesCount = messages.filter(message => message.status === 'unread').length;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="p-4">
                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between">
                    <div className="flex items-center ml-2">
                        <h1 className="text-xl font-semibold text-[#2CC297]">{pageTitle}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Messages Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Mail className="h-5 w-5" />
                                    {/* Update jumlah pesan belum dibaca */}
                                    {unreadMessagesCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                                            {unreadMessagesCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[400px] p-0" align="end">
                                <Card className="shadow-lg">
                                    <div className="p-4 border-b">
                                        <h2 className="text-lg font-semibold">Pesan</h2>
                                    </div>
                                    <ScrollArea className="h-[400px]">
                                        <div className="divide-y">
                                            {messages.length === 0 ? (
                                                <div className="p-4 text-center text-gray-600">Tidak ada pesan baru</div>
                                            ) : (
                                                messages.map((message) => (
                                                    <div key={message.id} className="flex items-start gap-3 p-4 hover:bg-gray-50">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={message.avatar || "/default-avatar.png"} />
                                                            <AvatarFallback>{message.sender_name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium text-black">{message.sender_name}</p>
                                                            <p className="text-sm text-gray-600">{message.message}</p>
                                                            {message.status === 'unread' && (
                                                                <Button
                                                                    onClick={() => handleMarkAsRead(message.id)}
                                                                    size="small"
                                                                    variant="outline"
                                                                    className="mt-2"
                                                                >
                                                                    Tandai sebagai Dibaca
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </Card>
                            </PopoverContent>
                        </Popover>
                        {/* Notifications Popover */}
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                                    {notifications.length} {/* Menampilkan jumlah notifikasi */}
                                </span>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[400px] p-0" align="end">
                            <Card className="shadow-lg">
                                <div className="p-4 border-b">
                                    <h2 className="text-lg font-semibold">Notifications</h2>
                                </div>
                                <ScrollArea className="h-[400px]">
                                    <div className="divide-y">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-gray-600">Tidak ada notifikasi baru</div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div key={notification.id} className="flex items-start gap-3 p-4 hover:bg-gray-50">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={notification.avatar || "/default-avatar.png"} />
                                                        <AvatarFallback>{notification.title[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-sm font-medium text-black">{notification.title}</p>
                                                        <p className="text-sm text-gray-600">{notification.description}</p>
                                                        <p className="text-xs text-gray-500">{notification.time}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </Card>
                        </PopoverContent>
                    </Popover>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm font-medium">{fullName}</div>
                                <div className="text-xs text-gray-500">{userProfile.role}</div>
                            </div>
                            <img
                                src={`http://localhost:5000${userProfile.profileImage || "/Avatar.svg"}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={`http://localhost:5000${userProfile.profileImage || "/Avatar.svg"}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="text-left hidden sm:block">
                                <div className="text-sm font-medium">{fullName}</div>
                                <div className="text-xs text-gray-500">{userProfile.role}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                        {/* Mobile Messages Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Mail className="h-5 w-5" />
                                    {/* Update jumlah pesan belum dibaca */}
                                    {unreadMessagesCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                                            {unreadMessagesCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-screen max-w-[235px] p-0" align="end" alignOffset={-8} sideOffset={8}>
                                <Card className="shadow-lg">
                                    <div className="p-4 border-b">
                                        <h2 className="text-lg font-semibold">Pesan</h2>
                                    </div>
                                    <ScrollArea className="h-[370px]">
                                        <div className="divide-y">
                                            {messages.map((message) => (
                                                <div key={message.id} className="flex items-start gap-2 p-3 hover:bg-gray-50">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={message.avatar} />
                                                        <AvatarFallback>{message.sender_name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-sm font-medium text-black">{message.sender_name}</p>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                                                        {message.status === 'unread' && (
                                                            <Button
                                                                onClick={() => handleMarkAsRead(message.id)}
                                                                size="small"
                                                                variant="outline"
                                                                className="mt-2"
                                                            >
                                                                Tandai sebagai Dibaca
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </Card>
                            </PopoverContent>
                        </Popover>
                        {/* Notifications Popover (Mobile) */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-screen max-w-[290px] p-0" align="end" alignOffset={-8} sideOffset={8}>
                                <Card className="shadow-lg">
                                    <div className="p-4 border-b">
                                        <h2 className="text-lg font-semibold">Notifications</h2>
                                    </div>
                                    <ScrollArea className="h-[250px] md:h-[300px]">
                                        <div className="divide-y">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-600">No new notifications</div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div key={notification.id} className="flex items-start gap-2 p-3 hover:bg-gray-50">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={notification.avatar || "/placeholder.svg?height=40&width=40"} />
                                                            <AvatarFallback>{notification.title[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium text-black">{notification.title}</p>
                                                            <p className="text-sm text-gray-600 line-clamp-2">{notification.description}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </Card>
                            </PopoverContent>
                        </Popover>

                            {/* Logout Button (Mobile/Tablet) */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onLogout}
                                className="lg:hidden"
                            >
                                <LogOut className="h-5 w-5 text-red-600" />
                            </Button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </header>
    );
};

export default Navbar;