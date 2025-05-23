import { Metadata } from 'next'
import Content from './Content'
import React from 'react'

export const metadata: Metadata = {
    title: "Pulse Account",
    description: "Create & manage your data on Pulse services"
}

const page = () => {
    return (
        <Content />
    )
}

export default page