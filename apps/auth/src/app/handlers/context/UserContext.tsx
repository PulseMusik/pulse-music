'use client'

import React, { useState, createContext, useContext, useEffect } from "react";

interface UserContextType {
    userData: any;
    setUserData: React.Dispatch<React.SetStateAction<any>>;
    isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

import { API_URL } from "@pulse/lib/constants";

export const AuthProvider = ({ children }: Props) => {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)


    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/users/get_auth_user`, {
                    credentials: 'include'
                });
                const data = await response.json();
                setUserData(data.data);
            } catch (e) {
                console.error('Error, user might not be authenticated', e);
            } finally {
                setIsLoading(false)
            }
        };

        fetchData();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a AuthProvider");
    }
    return context;
};