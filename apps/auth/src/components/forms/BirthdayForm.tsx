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
            dob: {
                day: data.day,
                month: data.month,
                year: data.year
            },
            gender: data.gender
        }));
        router.push('/v1/onboarding/password')
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return (
        <Wrapper title='Basic information' description='Enter your birthday and gender'>
            <div className='h-full'>
                <form className='flex justify-center items-center flex-col space-y-2 relative h-full pt-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('day', {
                                required: 'Day is required',
                                min: { value: 1, message: 'Day must be between 1 and 31' },
                                max: { value: 31, message: 'Day must be between 1 and 31' }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Day'
                        />
                        {errors.day && (
                            <span className='text-red-500 text-sm pl-1'>{errors.day.message as string}</span>
                        )}
                    </div>
                    <div className='flex flex-col space-y-2 w-full'>
                        <select
                            {...register('month', {
                                required: 'Month is required',
                                min: { value: 1, message: 'Month must be between 1 and 12' },
                                max: { value: 12, message: 'Month must be between 1 and 12' }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                        >
                            <option value=''>Select month</option>
                            {months.map((month) => {
                                return <option key={month} value={month}>{month}</option>
                            })}
                        </select>
                        {errors.month && (
                            <span className='text-red-500 text-sm pl-1'>{errors.month.message as string}</span>
                        )}
                    </div>
                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('year', {
                                required: 'Year is required',
                                min: { value: 1900, message: 'Year must be valid' },
                                max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Year'
                        />
                        {errors.year && (
                            <span className='text-red-500 text-sm pl-1'>{errors.year.message as string}</span>
                        )}
                    </div>
                    <div className='flex flex-col space-y-2 w-full'>
                        <select
                            {...register('gender', { required: 'Gender is required' })}
                            className=' w-full p-2 px-4 rounded border_muted border-1'
                        >
                            <option value=''>Select gender</option>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='prefer-not-to-say'>Prefer not to say</option>
                        </select>
                        {errors.gender && (
                            <span className='text-red-500 text-sm pl-1'>{errors.gender.message as string}</span>
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