import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        role: "",
        address: "",
        profileImage: '/Avatar.svg'
    });

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                  const data = await response.json();
                  console.log("Data profileImage dari backend di frontend:", data.profileImage); // Debugging
                  
                  setUserProfile({
                      ...data,
                      profileImage: data.profileImage || '/Avatar.svg' // Gunakan default jika kosong
                  });
                  localStorage.setItem('userProfile', JSON.stringify({ ...data, profileImage: data.profileImage || '/Avatar.svg' }));
              } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <UserContext.Provider value={{ userProfile, setUserProfile, fetchUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

export { UserContext };