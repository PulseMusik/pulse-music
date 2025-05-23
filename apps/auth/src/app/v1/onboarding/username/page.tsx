import Wrapper from '@/components/wrapper'
import React from 'react'

import UsernameForm from '@/components/forms/UsernameForm'
import { Metadata } from 'next'
import { COMPANY_NICKNAME } from '@pulse/lib/constants'

export const metadata: Metadata = {
    title: `Create your ${COMPANY_NICKNAME} account`
}

const page = () => {
    return (
        <UsernameForm />
    )
}

export default page
