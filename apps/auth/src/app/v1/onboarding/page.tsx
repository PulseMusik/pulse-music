import Wrapper from '@/components/wrapper'
import React from 'react'

import { Metadata } from 'next'
import StartForm from '@/components/forms/StartForm'

export const metadata: Metadata = {
    title: 'Create your Pulse account'
}

const page = () => {
    return (
        <StartForm />
    )
}

export default page