'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdLocalFireDepartment, MdLocationOn } from 'react-icons/md'

interface Listing {
    id: string
    title: string
    images: string[]
    location_city: string
    price: number
}

export default function ExploreHero({ listings }: { listings: Listing[] }) {
    const [current, setCurrent] = useState(0)

    // Auto-rotate every 5 seconds
    useEffect(() => {
        if (listings.length <= 1) return
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % listings.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [listings.length])

    if (!listings || listings.length === 0) return null

    const activeListing = listings[current]

    return (
        <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 group bg-neutral-900">
            {/* Background Image (Fade Transition) */}
            {listings.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    {item.images?.[0] ? (
                        <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-700">
                            No Image
                        </div>
                    )}
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
            ))}

            {/* Content Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col items-start gap-2">

                {/* Badge */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-rose-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-lg shadow-rose-900/50 uppercase tracking-wider flex items-center gap-1">
                        <MdLocalFireDepartment /> À la une
                    </span>
                    <span className="bg-black/50 backdrop-blur text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wider flex items-center gap-1">
                        Premium
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl font-black text-white leading-tight drop-shadow-md max-w-2xl line-clamp-2">
                    {activeListing.title}
                </h2>

                {/* Meta */}
                <div className="flex items-center gap-4 text-slate-300 text-sm md:text-base font-medium mt-1">
                    <span className="flex items-center gap-1">
                        <MdLocationOn className="text-blue-500" /> {activeListing.location_city}
                    </span>
                    {activeListing.price > 0 && (
                        <span className="text-emerald-400 font-bold bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-500/20">
                            {activeListing.price.toLocaleString()} FCFA
                        </span>
                    )}
                </div>

                {/* Indicators */}
                <div className="absolute bottom-6 right-6 md:right-10 flex gap-2">
                    {listings.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>

            <Link href={`/listings/${activeListing.id}`} className="absolute inset-0 z-10" aria-label={`Voir ${activeListing.title}`} />
        </div>
    )
}
