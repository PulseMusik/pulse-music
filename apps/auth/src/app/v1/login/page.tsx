import React from 'react'

import { Metadata } from 'next'
import LoginForm from '@/components/forms/LoginForm'

import { APP_NAMES } from '@pulse/lib/constants'

export const metadata: Metadata = {
    title: `Sign in | ${APP_NAMES.ACCOUNTS}`
}

const page = () => {
    return (
        <LoginForm />
    )
}

export default page