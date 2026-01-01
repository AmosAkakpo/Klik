import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import Link from 'next/link';
const HomeHero = () => {
    return (
        <div className='flex flex-col px-2 py-6 bg-neutral-900 border-gray-300'>
            <div className='flex flex-col items-center text-center'>
                <h2 className='text-3xl font-bold'>
                    Découvrez ce qui bouge près de vous
                </h2>
                <p>Événements, services, restaurants et annonces locales — tout au même endroit.</p>

            </div>
            <div className='flex justify-evenly py-2'>
                <Link href={'/explorez'} className='bg-blue-500 rounded-lg px-3 py-1 '>
                    Explore &gt;
                </Link>
                <Link href={'/contact'} className='bg-rose-500 rounded-lg px-3 py-1 '>
                    Publier une annonce
                </Link>
            </div>

        </div>


    )
}

export default HomeHero