'use client'

import Wrapper from '@/components/wrapper'
import React, { useEffect } from 'react'

import { useForm } from 'react-hook-form';
import { useSignup } from '@/app/handlers/context/SignupContext';
import { useRouter } from 'next/navigation';

const BirthdayForm = () => {
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

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return (
        <Wrapper title='Set up your Pulse identity' description='Pick a username for your profile and provide a valid email for account recovery.'>
            <div className='h-full'>
                <form className='flex justify-center items-center flex-col space-y-2 relative h-full pt-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('username', {
                                required: 'Username is required',
                                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                                maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
                                pattern: {
                                    value: /^[a-zA-Z0-9_]+$/,
                                    message: 'Username can only contain letters, numbers, and underscores'
                                }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Username'
                        />
                        {errors.username && (
                            <span className='text-red-500 text-sm pl-1'>{errors.username.message as string}</span>
                        )}
                    </div>

                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Enter a valid email address'
                                }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Email'
                            type='email'
                        />
                        {errors.email && (
                            <span className='text-red-500 text-sm pl-1'>{errors.email.message as string}</span>
                        )}
                    </div>

                    <div className='flex w-full justify-center'>
                        <button className=' bg-blue-400 cursor-pointer rounded text-white hover:shadow-sm flex justify-center items-center leading-7.5 h-7.5 p-5 mt-3 w-full'>Next</button>
                    </div>
                </form>
            </div>
        </Wrapper>
    )
}

export default BirthdayForm