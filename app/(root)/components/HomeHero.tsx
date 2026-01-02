import React from 'react'
import { FaArrowRight, FaPlus } from "react-icons/fa6";
import Link from 'next/link';
import { MdExplore } from "react-icons/md";

const HomeHero = () => {
    return (
        <section className='relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 -mt-20 pt-32 overflow-hidden'>
            {/* Background with Gradient and Texture */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-neutral-900"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] opacity-30"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/50 border border-neutral-700 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Le Guide N°1 au Bénin</span>
                </div>

                {/* Main Heading */}
                <h1 className='text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-tight tracking-tight'>
                    Découvrez ce qui bouge <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">Près de Vous</span>
                </h1>

                {/* Subheading */}
                {/* <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Accédez aux meilleurs événements, restaurants, services et bons plans locaux.
                    Tout ce dont vous avez besoin, réuni sur une seule plateforme premium.
                </p> */}

                {/* CTA Buttons */}
                <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
                    <Link
                        href={'/explorez'}
                        className='group relative inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-blue-500 hover:scale-105 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40'
                    >
                        Explorer Maintenant
                        <MdExplore className="text-xl group-hover:rotate-12 transition-transform" />
                    </Link>

                    <Link
                        href={'/contact'}
                        className='group inline-flex items-center gap-3 bg-neutral-800 text-gray-200 border border-neutral-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-neutral-700 hover:text-white hover:border-neutral-600'
                    >
                        <FaPlus className="text-sm" />
                        Publier une Annonce
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 opacity-50">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-gray-500 to-transparent"></div>
            </div>
        </section>
    )
}

export default HomeHero