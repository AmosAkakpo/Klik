'use client'
import React, { useEffect, useRef } from 'react'

const WhatWeDo = () => {
    const items = [
        {
            title: "Événements & sorties",
            description: "Concerts, soirées, conférences, événements culturels et plus encore.",
            gradient: "from-violet-600 to-purple-600"
        },
        {
            title: "Nouveaux services",
            description: "Restaurants, parfums, vêtements, prestations locales — découvrez les nouveautés.",
            gradient: "from-blue-600 to-cyan-600"
        },
        {
            title: "L'actualité sur KLik",
            description: "Les activités en tendance, les annonces mises en avant et les événements populaires.",
            gradient: "from-rose-600 to-pink-600"
        }
    ]

    const cardsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const handleScroll = () => {
            cardsRef.current.forEach((card, index) => {
                if (!card) return

                const rect = card.getBoundingClientRect()
                const windowHeight = window.innerHeight
                const cardTop = rect.top
                const cardHeight = rect.height

                // Calculate progress (0 to 1) as card enters viewport
                const progress = Math.max(0, Math.min(1, (windowHeight - cardTop) / (windowHeight + cardHeight)))

                // Scale effect: starts at 0.9 and scales to 1
                const scale = 0.9 + (progress * 0.1)

                // Apply transforms (Opacity removed as requested)
                card.style.transform = `scale(${scale})`
            })
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial call

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className='bg-neutral-950 py-16 px-4'>
            <div className='max-w-4xl mx-auto mb-12'>

                <p className='text-gray-400 text-center text-lg'>
                    Découvrez tout ce qui se passe autour de vous
                </p>
            </div>

            <div className='max-w-5xl mx-auto space-y-8 pb-24'>
                {items.map((item, index) => (
                    <div
                        key={index}
                        ref={el => { cardsRef.current[index] = el }}
                        className='sticky top-24 transition-transform duration-100 ease-out will-change-transform'
                        style={{
                            // Fix: Higher index = higher z-index so next cards stack ON TOP
                            zIndex: index + 1,
                            transform: 'scale(0.9)',
                            // Fix: Removed opacity for solid background
                        }}
                    >
                        <div className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-8 shadow-2xl border border-neutral-700/50 min-h-[300px] flex flex-col justify-center`}>
                            <h3 className='text-3xl font-bold text-white mb-4'>
                                {item.title}
                            </h3>
                            <p className='text-white/95 text-lg leading-relaxed font-medium'>
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default WhatWeDo