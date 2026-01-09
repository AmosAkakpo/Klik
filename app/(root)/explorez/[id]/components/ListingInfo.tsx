'use client'

import { MdLocationOn, MdCategory } from 'react-icons/md'

interface ListingInfoProps {
    title: string
    price: number | null
    location_city: string
    location_district: string | null
    category: { name: string; slug: string }
    plan: { name: string; slug: string }
    tier: string
}

export default function ListingInfo({
    title,
    price,
    location_city,
    location_district,
    category,
    plan,
    tier
}: ListingInfoProps) {
    return (
        <div className="space-y-4">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                    <MdCategory className="inline mr-1" />
                    {category.name}
                </span>

                {tier === 'premium' && (
                    <span className="px-3 py-1 bg-rose-600/20 text-rose-400 text-xs font-bold rounded-full border border-rose-500/30">
                        ⭐ PREMIUM
                    </span>
                )}

                {tier === 'pro' && (
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                        PRO
                    </span>
                )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-slate-400">
                <MdLocationOn className="text-blue-500 text-xl" />
                <span className="font-medium">
                    {location_district ? `${location_district}, ` : ''}{location_city}
                </span>
            </div>

            {/* Price */}
            {price && price > 0 && (
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl shadow-lg shadow-emerald-900/30">
                    <p className="text-2xl md:text-3xl font-black text-white">
                        {price.toLocaleString()} <span className="text-lg font-bold">FCFA</span>
                    </p>
                </div>
            )}
        </div>
    )
}
