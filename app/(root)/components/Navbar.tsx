'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

    // Common link styles to ensure consistency
    const linkStyles = (isActive: boolean) => `
        relative px-2 py-1 transition-all duration-300 ease-in-out font-medium
        ${isActive ? 'text-blue-500 scale-105' : 'text-gray-300 hover:text-white hover:scale-105'}
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] 
        after:bg-gradient-to-r after:from-blue-500 after:to-violet-500
        after:transition-all after:duration-300
        hover:after:w-full
        ${isActive ? 'after:w-full' : ''}
    `

    return (
        <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
            <nav className="max-w-7xl mx-auto py-4 px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-extrabold tracking-wider text-white">
                        <span className="text-rose-500">KL</span>ik
                    </Link>

                    {/* Desktop Links - Consistent with Mobile Style */}
                    <div className="hidden sm:flex items-center gap-12">
                        {navlinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.path}
                                className={linkStyles(pathname === link.path)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleNavbar}
                        className="sm:hidden text-2xl text-white p-2"
                    >
                        {isNavbarOpen ? <IoClose /> : <RxHamburgerMenu />}
                    </button>
                </div>

                {/* Mobile Menu - "Well Spread" Design */}
                <div className={`
                    sm:hidden absolute top-full left-0 w-full bg-neutral-900 border-b border-neutral-800
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${isNavbarOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div className="flex flex-col items-center gap-8 py-8">
                        {navlinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.path}
                                onClick={() => setIsNavbarOpen(false)}
                                className={`text-lg tracking-wide ${linkStyles(pathname === link.path)}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar