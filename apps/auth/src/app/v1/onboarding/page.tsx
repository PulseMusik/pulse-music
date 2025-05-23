import Wrapper from '@/components/wrapper'
import React from 'react'

import { Metadata } from 'next'
import StartForm from '@/components/forms/StartForm'
import { COMPANY_NICKNAME } from '@pulse/lib/constants'

export const metadata: Metadata = {
    title: `Create your ${COMPANY_NICKNAME} account`
}

const page = () => {
    return (
        <StartForm />
    )
}

export default page