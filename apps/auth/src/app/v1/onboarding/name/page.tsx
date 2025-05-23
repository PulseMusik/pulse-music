import Wrapper from '@/components/wrapper'
import React from 'react'

import NameForm from '@/components/forms/NameForm'
import { Metadata } from 'next'
import { COMPANY_NICKNAME } from '@pulse/lib/constants'

export const metadata: Metadata = {
    title: `Create your ${COMPANY_NICKNAME} account`
}

const page = () => {
    return (
        <NameForm />
    )
}

export default page