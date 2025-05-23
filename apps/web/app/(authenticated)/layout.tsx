'use client'

import React, {useEffect} from 'react'
import { useUser } from '../lib/auth/UserContext'
import { useRouter } from 'next/navigation'
import { ACCOUNTS_URL, ACCOUNTS_URL_ENDPOINTS } from '@pulse/lib/constants'

import Header from '../components/header'

const layout = ({children}: {children: React.ReactNode}) => {
  const {userData, isLoading} = useUser()
  const router = useRouter()

    useEffect(() => {
      if (!userData && !isLoading) {
          router.replace(`${ACCOUNTS_URL}/v1/login`)
      }
  }, [isLoading, userData, router])

  if (!userData) return null

  return (
    <main>
        <Header />
        {children}
    </main>
  )
}

export default layout