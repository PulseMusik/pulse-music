import React from 'react'

interface Props {
    children: React.ReactNode,
    title: string,
    description?: string
}

const Wrapper = ({ children, title, description }: Props) => {
    return (
        <div className='min-h-screen w-full bg-[#f2f2f2] flex items-center justify-center'>
            <div className='w-full max-w-md bg-white shadow-md rounded-xl px-10 py-12'>
                <div className='flex flex-col items-center text-center space-y-4'>
                    <img src="/logos/blue/blue_filled.png" alt="Logo" className="w-24" />
                    <h1 className='text-2xl font-medium'>{title}</h1>
                    {description && <p className='text-sm text-gray-600'>{description}</p>}
                </div>
                <div className='mt-8'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Wrapper