'use client'

import { Metadata } from 'next'
import React from 'react'
import { useUser } from '../handlers/context/UserContext'

import { motion } from 'framer-motion'
import { DEFAULT_PROFILE_PICTURE } from '@pulse/lib/constants'

import ChangeProfilePicture from '@pulse/ui/dialogs/ChangeProfilePicture'
import { useTranslation } from 'react-i18next'
import { FaAppStore, FaBell, FaLock, FaPencilAlt } from 'react-icons/fa'

const Content = () => {
    const { userData } = useUser()
    const {t} = useTranslation()

    return (
        <div>
            <div className='flex flex-col items-center space-y-4 md:px-8 lg:px-4 px-4'>
                <ChangeProfilePicture data={userData || null}>
                    <motion.img whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className='w-15 rounded-full cursor-pointer' src={userData?.pictures?.current?.url || DEFAULT_PROFILE_PICTURE} />
                </ChangeProfilePicture>

                <div className='text-center'>
                    <p className='text-3xl'>{userData?.firstName ? `Hello, ${userData?.firstName}!` : 'Hello!'}</p>
                    <p className='px-2'>Manage your info, privacy, and security to optimize your Pulse experience.</p>
                </div>
                <div className={`gap-2 ${userData?.emailVerified ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'}`}>

                    {!userData?.emailVerified && (
                        <div className='card shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-4 px-6 rounded-2xl flex xl:w-130 space-x-2 items-center justify-between md:w-full'>
                            <div className='pr-4'>
                                <h1 className='text-[19px]'>Verify your email</h1>
                                <p className='text-sm'>We noticed that you haven't verified your email. Protect your email with an email verification.</p>
                            </div>
                            <img className='h-20' src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExejN4MzhtM2tqN3Y5OWxvM256c3p0bjR4Ymh1MDFsNXA2cnJvODIycSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/hPKw8QCM4SR53s42xN/giphy.gif" />
                        </div>
                    )}

                    <div className='card shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-4 px-6 rounded-2xl flex xl:w-130 space-x-2 items-center justify-between md:w-full'>
                        <div className='pr-4'>
                            <h1 className='text-[19px]'>Add a recovery phone number</h1>
                            <p className='text-sm'>Add a recovery phone number to make sure you never lose access to Pulse services, even if you get locked out</p>
                        </div>
                        <img className='h-15' src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXQ1cXFtNXNjeTZhZ2xoc2U0aDM1Z3NpYXNwdXdqOWcyNGZqcjZiNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/MaEHwVOESdbRwrF971/giphy.gif" />
                    </div>

                </div>

                <div className='w-full grid gap-2 grid-cols-1'>
                    <div className='w-full border-gray-100 border rounded flex items-center p-2 px-4 gap-2 hover:bg-gray-100 transition cursor-pointer'>
                        <FaPencilAlt style={{fontSize: '20px'}} />
                        <p className='relative top-0.25'>Manage your profile</p>
                    </div>

                    <div className='w-full border-gray-100 border rounded flex items-center p-2 px-4 gap-2 hover:bg-gray-100 transition cursor-pointer'>
                        <FaLock style={{fontSize: '20px'}} />
                        <p className='relative top-0.25'>Change your password</p>
                    </div>

                    <div className='w-full border-gray-100 border rounded flex items-center p-2 px-4 gap-2 hover:bg-gray-100 transition cursor-pointer'>
                        <FaAppStore style={{fontSize: '20px'}} />
                        <p className='relative top-0.25'>Manage apps</p>
                    </div>

                    
                    <div className='w-full border-gray-100 border rounded flex items-center p-2 px-4 gap-2 hover:bg-gray-100 transition cursor-pointer'>
                        <FaBell style={{fontSize: '20px'}} />
                        <p className='relative top-0.25'>Notification settings</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Content