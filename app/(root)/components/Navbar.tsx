'use client'
import React, { use, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// icons
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
const Navbar = () => {
    const navlinks = [
        { name: "Acceuil", path: '/' },
        { name: 'Explorez', path: '/explorez' },
        { name: 'Contact', path: '/contact' }
    ]
    const pathname = usePathname();
    const [isNavbarOpen, setIsNavbarOpen] = useState(false)
    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen)
    }

    const closeNavbar = () => {
        setIsNavbarOpen(false)
    }
    return (
        <header>
            {/* pc version */}
            <nav className=' hidden sm:block'>
                <div className='flex justify-between items-center py-3 px-5'>
                    <div>
                        <Link href="/" className='text-3xl font-extrabold tracking-wider'>KLik</Link>
                    </div>
                    <div className='flex space-x-2'>
                        {navlinks.map((link, index) => (
                            <Link key={index} href={link.path}
                                className={`hover:ease-in-out duration-300 hover:scale-110 mx-4 ${link.path === pathname ? 'text-primary-blue' : 'text-gray-100'}`}>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>


            </nav>


            {/* smartphone version  */}
            <nav className=' sm:hidden fixed bg-neutral-900 top-0 z-50 w-full'>

                <div className="flex items-center gap-6 py-4 px-5">
                    <Link href="/" className='text-xl font-extrabold tracking-wider text-gray-100'>
                        <span className="text-rose-500">KL</span>ik
                    </Link>
                    {navlinks.map((link, index) => (
                        <Link key={index} href={link.path}
                            className={`hover:ease-in-out duration-300 hover:scale-110 ${link.path === pathname ? 'text-blue-500' : 'text-gray-100'}`}>
                            {link.name}
                        </Link>
                    ))}
                </div>



            </nav>
        </header>
    )
}

export default Navbar