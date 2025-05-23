import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { redirect } from 'next/navigation'

interface Props {
    children: React.ReactNode,
}

const DeleteAccount = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await delay(2500)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
            setIsOpen(false)
            setTimeout(() => {
                redirect('http://localhost:4000/v1/onboarding/login')
            }, 200);
        }
    }

    return (
        <div className='w-full'>
            <div className='flex items-center gap-2 w-full' onClick={() => setIsOpen(true)}>
                {children}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className='fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.25 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring' }}
                            className='bg-white w-full max-w-md p-6 rounded-xl shadow-lg'
                        >
                            <h1 className='text-lg font-semibold mb-3'>Delete your Pulse account?</h1>

                            <p className='text-sm text-gray-700 leading-relaxed'>
                                Are you sure you want to delete your Pulse account?
                                <br /><br />
                                This can be reverted within 30 days of deletion. You’ll receive reminder emails
                                7 days and 2 days before permanent deletion, allowing you to revoke the decision.
                            </p>

                            <div className='mt-6 flex justify-end gap-3'>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className='px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition cursor-pointer'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer w-20 flex justify-center items-center'
                                >
                                    {!isLoading ? (
                                        <p>Delete</p>
                                    ) : (
                                        <img className='invert_color' src="/spinners/180-ring.svg" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}

export default DeleteAccount