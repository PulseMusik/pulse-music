import Wrapper from '@/components/wrapper'
import React from 'react'

import PasswordForm from '@/components/forms/PasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create your Pulse account'
}

const page = () => {
    return (
        <PasswordForm />
    )
}

export default page