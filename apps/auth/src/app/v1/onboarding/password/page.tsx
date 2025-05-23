import Wrapper from '@/components/wrapper'
import React from 'react'

import PasswordForm from '@/components/forms/PasswordForm'
import { Metadata } from 'next'
import { COMPANY_NICKNAME } from '@pulse/lib/constants'

export const metadata: Metadata = {
    title: `Create your ${COMPANY_NICKNAME} account`
}

const page = () => {
    return (
        <PasswordForm />
    )
}

export default page