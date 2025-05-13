import Wrapper from '@/components/wrapper'
import React from 'react'

import BirthdayForm from '@/components/forms/BirthdayForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create your Pulse account'
}

const page = () => {
    return (
        <BirthdayForm />
    )
}

export default page
