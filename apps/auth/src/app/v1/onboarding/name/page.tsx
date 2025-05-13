import Wrapper from '@/components/wrapper'
import React from 'react'

import NameForm from '@/components/forms/NameForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create your Pulse account'
}

const page = () => {
    return (
        <NameForm />
    )
}

export default page