'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MdLocationOn, MdStar } from 'react-icons/md'

interface ListingProps {
    listing: {
        id: string
        title: string
        price: number
        images: any[]
        location_city: string
        plan_slug: string
        is_boosted: boolean
    }
}

// Helper to optimize image URLs for low data usage
function optimizeImageUrl(url: string | null): string | null {
    if (!url) return null

    // For external URLs (unsplash, picsum), add size/quality params
    if (url.includes('unsplash.com')) {
        return `${url}&w=400&q=75&auto=format`
    }
    if (url.includes('picsum.photos')) {
        return url.replace(/\/\d+\/\d+/, '/400/300')
    }

    // For Supabase storage, add transform params
    if (url.includes('supabase.co')) {
        return `${url}?width=400&quality=75`
    }

    return url
}

export default function ListingCard({ listing }: ListingProps) {
    const rawImageUrl = typeof listing.images?.[0] === 'string'
        ? listing.images[0]
        : listing.images?.[0]?.url || null

    const imageUrl = optimizeImageUrl(rawImageUrl)

    return (
        <Link
            href={`/explorez/${listing.id}`}
            className="group block bg-neutral-900/40 rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all hover:bg-neutral-900 shadow-lg shadow-black/20"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                        Aucun visuel
                    </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {listing.is_boosted && (
                        <span className="px-2 py-1 rounded-lg bg-orange-500 text-white text-[10px] font-black shadow-lg shadow-orange-900/50">
                            BOOST ⚡
                        </span>
                    )}
                    {listing.plan_slug === 'premium' && (
                        <span className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-black shadow-lg shadow-rose-900/50">
                            PREMIUM
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 space-y-2">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <MdLocationOn className="text-blue-500" />
                    {listing.location_city}
                </div>

                <h3 className="font-bold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {listing.title}
                </h3>

                <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-black text-white">
                        {listing.price > 0 ? `${listing.price.toLocaleString()} FCFA` : 'Prix sur demande'}
                    </span>
                    <div className="flex text-blue-500">
                        <MdStar /><MdStar /><MdStar />
                    </div>
                </div>
            </div>
        </Link>
    )
}
