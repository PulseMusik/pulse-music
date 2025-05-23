import React, { useState } from 'react'

type Props = {
  children: React.ReactNode,
  open?: boolean,
  setOpen?: (open: boolean) => void,
  data: any
}

import { MdClose } from "react-icons/md";
import { FaEllipsisV, FaPencilAlt, FaTrash, FaTrashAlt } from "react-icons/fa";

import { AnimatePresence, motion } from 'framer-motion'

import {DEFAULT_PROFILE_PICTURE} from '../../../lib/src/lib/constants'

const ChangeProfilePicture = ({children, open, setOpen, data}: Props) => {
  const [isOpen, setIsOpen] = useState(open || false)
  
  return (
    <div className='w-full flex items-center justify-center'>
        <div className='flex items-center justify-center' onClick={() => setIsOpen(!isOpen)}>
          {children}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
            className='fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center w-full h-screen'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
              <motion.div className='w-full max-w-md bg-white p-4 flex justify-between items-center' style={{borderRadius: '16px', margin: '10px 0'}}
                initial={{ scale: 0.25 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}>
                  <div className='flex flex-col' style={{gap: '24px', margin: '20px 10px'}}>
                      <div className='flex items-center justify-between w-full'>
                        <FaEllipsisV style={{fontSize: '20px'}} />
                        <p className='text-lg font-semibold relative' style={{top: '1.5px'}}>Change your profile picture</p>
                        <MdClose onClick={() => setIsOpen(!isOpen)} style={{fontSize: '20px'}} className='cursor-pointer'/>
                      </div>
                      <div>
                        <h1 className='text-lg font-semibold'>Profile Picture</h1>
                        <p style={{fontSize: '14px', color: '#444746'}}>A profile picture helps people recognize you and lets you know when you're signed in to your account</p>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img src={data?.pictures?.current?.url || DEFAULT_PROFILE_PICTURE} alt='profile picture'  style={{borderRadius: '100%', width: '65%'}} />
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                        <button className='px-4 py-2 rounded-full flex items-center justify-center cursor-pointer' style={{gap: '10px', padding: '10px 30px', backgroundColor: '#c2e7ff'}}>
                            <FaPencilAlt/>
                            <p style={{position: 'relative', top: '1.85px'}}>Change</p>
                        </button>
                        <button className='px-4 py-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200' style={{gap: '10px', padding: '10px 30px', backgroundColor: '#c2e7ff'}}>
                            <FaTrashAlt />
                            <p style={{position: 'relative', top: '1.85px'}}>Remove</p>
                        </button>
                      </div>
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}

export default ChangeProfilePicture