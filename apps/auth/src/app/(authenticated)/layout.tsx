'use client'

import Header from '@/components/header'
import { useRouter } from 'next/navigation'
import { useUser } from '../handlers/context/UserContext'
import { useEffect } from 'react'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { userData, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!userData && !isLoading) {
            router.replace('/v1/login')
        }
    }, [isLoading, userData, router])

    if (!userData) return null

    return (
        <>
            <Header />
            <div className='w-full flex justify-center'>
                {children}
            </div>
        </>
    )
}