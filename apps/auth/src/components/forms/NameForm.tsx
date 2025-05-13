'use client'

import Wrapper from '@/components/wrapper'
import React, { useEffect } from 'react'

import type { Metadata } from 'next';
import { useForm } from 'react-hook-form';
import { useSignup } from '@/app/handlers/context/SignupContext';

import { useRouter } from 'next/navigation';

const NameForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const { setSignupData, signupData } = useSignup()

    const router = useRouter()

    const onSubmit = (data: any) => {
        setSignupData(prev => ({ ...prev, firstName: data.firstName, middleName: data.middleName || '', lastName: data.lastName }));
        router.push('/v1/onboarding/birthdaygender')
    }

    return (
        <Wrapper title='Create an Pulse account' description='Enter your name'>
            <div className='h-full'>
                <form className='flex justify-center items-center flex-col space-y-2 relative h-full pt-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('firstName', {
                                required: 'First name is required',
                                minLength: { value: 2, message: 'First name must be at least 2 characters' },
                                maxLength: { value: 50, message: 'First name cannot exceed 50 characters' }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='First name'
                        />
                        {errors.firstName && (
                            <span className='text-red-500 text-sm pl-1'>{errors.firstName.message as string}</span>
                        )}
                    </div>
                    <div className='flex flex-col space-y-2  w-full'>
                        <input
                            {...register('middleName', {
                                maxLength: { value: 50, message: 'Middle name cannot exceed 50 characters' }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Middle name (optional)'
                        />
                        {errors.middleName && (
                            <span className='text-red-500 text-sm pl-1'>{errors.middleName.message as string}</span>
                        )}
                    </div>
                    <div className='flex flex-col space-y-2 w-full'>
                        <input
                            {...register('lastName', {
                                required: 'Last name is required',
                                minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                                maxLength: { value: 50, message: 'Last name cannot exceed 50 characters' }
                            })}
                            className='w-full p-2 px-4 rounded border_muted border-1'
                            placeholder='Last name'
                        />
                        {errors.lastName && (
                            <span className='text-red-500 text-sm pl-1'>{errors.lastName.message as string}</span>
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

export default NameForm