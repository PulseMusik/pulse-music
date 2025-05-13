'use client'

import Wrapper from '@/components/wrapper'
import React, { useEffect } from 'react'

import { useForm } from 'react-hook-form';
import { useSignup } from '@/app/handlers/context/SignupContext';
import { useRouter } from 'next/navigation';

const StartForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const { setSignupData, signupData } = useSignup()

    const router = useRouter()

    const onSubmit = (data: any) => {
        setSignupData(prev => ({
            ...prev,
            username: data.username
        }));
        router.push('/v1/onboarding/password')
    }

    useEffect(() => {
        console.log(signupData)
    }, [signupData])

    return (
        <Wrapper title='Choose your sign-up method' description='Sign up easily using Google, Microsoft, Apple, or create a Pulse account with our simple sign-up process.'>
            <div className='h-full space-y-3'>
                <button
                    className='w-full p-2 px-4 rounded border-muted border-1 bg-white hover:bg-gray-100 focus:outline-none flex items-center justify-center gap-2 cursor-pointer'
                >
                    <img className='w-4' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ901eAwCHJkZ_K-vjQz9vX-WNgASX8gisXw&s" alt="Google" />
                    <p className='relative top-0.5'>Sign up with Google</p>
                </button>

                <button
                    className='w-full p-2 px-4 rounded border-muted border-1 bg-white hover:bg-gray-100 focus:outline-none flex items-center justify-center gap-2 cursor-pointer'
                >
                    <img className='w-4' src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" alt="Microsoft" />
                    <p className='relative top-0.5'>Sign up with Microsoft</p>
                </button>

                <button
                    className='w-full p-2 px-4 rounded border-muted border-1 bg-white hover:bg-gray-100 focus:outline-none flex items-center justify-center gap-2 cursor-pointer'
                >
                    <img className='w-3.5' src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
                    <p className='relative top-0.5'>Sign up with Apple</p>
                </button>
                <button
                    className="w-full p-3 px-5 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none flex items-center justify-center gap-3 cursor-pointer transition-all duration-300"
                    onClick={() => router.push('/v1/onboarding/name')}
                >
                    <p className="text-sm font-semibold relative top-0.5">Sign up using Pulse</p>
                </button>
            </div>
        </Wrapper>
    )
}

export default StartForm