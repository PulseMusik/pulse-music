'use client'

import { useUser } from '@/app/handlers/context/UserContext'
import React from 'react'
import Tooltip from './ui/tooltip'
import { DEFAULT_PROFILE_PICTURE } from '@pulse/lib/constants'

import AccountDropdown from '@pulse/ui/dropdowns/AccountDropdown'

const Header = () => {
    const { userData } = useUser()

    return (
        <div className='px-8 py-2 justify-between flex items-center'>
            <div>
                <img className='h-13.5' src='/logos/blue/blue_filled.png' alt='Pulse 2025 logo' />
            </div>
            <div className='flex justify-end items-center'>
                <AccountDropdown user={userData}>
                    <img className='h-7.5 rounded-full cursor-pointer hover:shadow-sm' src={userData?.pictures?.current?.url || DEFAULT_PROFILE_PICTURE} />
                </AccountDropdown>
            </div>
        </div>
    )
}

export default Header