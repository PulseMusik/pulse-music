'use client'

import React, { useState, createContext, useContext } from "react";

interface SignupData {
    firstName: string;
    middleName?: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string,
    gender: '',
    dob: {
        day: string;
        month: string;
        year: string;
    };
}

interface SignupContextType {
    signupData: SignupData;
    setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
}

const defaultSignupData: SignupData = {
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: {
        day: '',
        month: '',
        year: ''
    }
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const SignupProvider = ({ children }: Props) => {
    const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);

    return (
        <SignupContext.Provider value={{ signupData, setSignupData }}>
            {children}
        </SignupContext.Provider>
    );
};

export const useSignup = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error("useSignup must be used within a SignupProvider");
    }
    return context;
};