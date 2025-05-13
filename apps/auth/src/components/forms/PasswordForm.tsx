'use client'

import Wrapper from '@/components/wrapper'
import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form';
import { useSignup } from '@/app/handlers/context/SignupContext';

const BirthdayForm = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm()

    const { setSignupData, signupData } = useSignup()

    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = (data: any) => {
        if (data.password !== data.confirmPassword) {
            console.error("Passwords don't match")
            return
        }

        setSignupData(prev => ({
            ...prev,
            password: data.password,
            confirmPassword: data.password,
        }));
    }

    useEffect(() => {
        console.log(signupData)
    }, [signupData])

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return (
        <Wrapper title='Create a strong password' description='Create a strong password with a mix of letters, numbers and symbols'>
            <div className='h-full'>
                <form className='flex justify-center items-center flex-col space-y-2 relative h-full pt-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Password'
                            type={showPassword ? 'text' : 'password'}
                        />
                        {errors.password && (
                            <span className='text-red-500 text-sm pl-1'>{errors.password.message as string}</span>
                        )}
                    </div>

                    <div className='w-full'>
                        <input
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value =>
                                    value === watch('password') || 'Passwords do not match'
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Confirm password'
                            className='w-full border border_muted rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        />
                        {errors.confirmPassword && (
                            <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message as string}</p>
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

                    <div className='flex w-full justify-center'>
                        <button className=' bg-blue-400 cursor-pointer rounded text-white hover:shadow-sm flex justify-center items-center leading-7.5 h-7.5 p-5 mt-3 w-full'>Next</button>
                    </div>
                </form>
            </div>
        </Wrapper>
    )
}

export default BirthdayForm