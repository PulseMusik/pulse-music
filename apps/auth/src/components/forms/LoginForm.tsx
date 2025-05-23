'use client'

import Wrapper from '@/components/wrapper'
import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form';
import { useSignup } from '@/app/handlers/context/SignupContext';
import { useRouter, useSearchParams } from 'next/navigation';

import { submitLogintoServer } from '@/app/handlers/form';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('continue')?.toString() || '';

    const { setSignupData, signupData } = useSignup()

    const router = useRouter()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const onSubmit = (data: any) => {
        setErrorMessage('')

        const dataToSend = {
            email: data.email,
            password: data.password
        }


        setIsSubmitting(true)
        try { submitLogintoServer(dataToSend as any, setErrorMessage as any, redirectUrl as string) } catch (e) { console.error(e) } finally { setIsSubmitting(false) }
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return (
        <Wrapper title='Welcome back!' description='Enter your credentials to sign in.'>
            <div className='h-full'>
                <form className='flex justify-center items-center flex-col space-y-2 relative h-full pt-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Email'
                        />
                        {errors.email && (
                            <span className='text-red-500 text-sm pl-1'>{errors.email.message as string}</span>
                        )}
                    </div>

                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('password', {
                                required: 'password is required'
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Password'
                            type={showPassword ? 'text' : 'password'}
                        />
                        {errors.password && (
                            <span className='text-red-500 text-sm pl-1'>{errors.password.message as string}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full mt-1">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="h-4 w-4 text-blue-600 accent-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="showPassword" className="text-sm text-gray-700 cursor-pointer select-none relative top-0.5">
                            Show password
                        </label>
                    </div>

                    {errorMessage && (
                        <p className='text-red-500 text-sm pl-1 mt-4 text-center'>{errorMessage}</p>
                    )}

                    <div className='flex w-full justify-center'>
                        <button className=' bg-blue-400 cursor-pointer rounded text-white hover:shadow-sm flex justify-center items-center leading-7.5 h-7.5 p-5 mt-3 w-full'>
                            {!isSubmitting ? (
                                <p>Next</p>
                            ) : (
                                <img className='invert_color' src="/spinners/180-ring.svg" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Wrapper>
    )
}

export default LoginForm