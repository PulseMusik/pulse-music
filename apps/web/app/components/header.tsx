import { DEFAULT_PROFILE_PICTURE, LOGOS } from "@pulse/lib/constants"
import { FaHome, FaSearch } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useUser } from "../lib/auth/UserContext"
import { useRef, useState } from "react"

import AccountDropdown from '@repo/ui/dropdowns/AccountDropdown'

function Header() {
    const {userData} = useUser()
    const searchRef = useRef(null)

    const [isSearching, setIsSearching] = useState(false) 

    const onInputChange = (searchTerm: string) => {
        if (!searchTerm.trim()) return
        console.log("Searching for " + searchTerm)
    }

    return (
        <header className="flex justify-between items-center px-8 py-4">
            <div className="flex gap-4 items-center">
                <div className="flex gap-4 items-center cursor-pointer hover:bg-gray-100 px-4 py-2 rounded"><FaHome/><h1>Home</h1></div>

                {!isSearching ? (
                    <div className="flex gap-4 items-center cursor-pointer hover:bg-gray-100 px-4 py-2 rounded" 
                    onClick={() => setIsSearching(true)}>
                        <FaSearch/>
                        <h1 style={{position: 'relative', top: '2px'}}>Search</h1>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center cursor-pointer hover:bg-gray-100 px-4 py-2 rounded">
                        <FaSearch />
                        <input style={{position: 'relative', top: '2px'}} placeholder="Search..." onChange={(e) => onInputChange(e.target.value)}/>
                        <IoClose onClick={() => setIsSearching(false)}/>
                    </div>
                )}
            </div>
            <div>
                <AccountDropdown user={userData}>
                    <img className="w-8 rounded-full cursor-pointer" src={userData?.pictures?.current?.url || DEFAULT_PROFILE_PICTURE}/>
                </AccountDropdown>
            </div>
        </header>
    )
}

export default Header