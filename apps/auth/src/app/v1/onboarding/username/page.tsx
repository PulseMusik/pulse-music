import Wrapper from '@/components/wrapper'
import React from 'react'

import UsernameForm from '@/components/forms/UsernameForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create your Pulse account'
}

const page = () => {
    return (
        <UsernameForm />
    )
}

export default page
