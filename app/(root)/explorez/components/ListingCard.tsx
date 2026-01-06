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

export default function ListingCard({ listing }: ListingProps) {
    // Handle JSONB images - could be array of strings or array of objects with 'url' property
    let imageUrl = null

    if (listing.images && listing.images.length > 0) {
        const firstImage = listing.images[0]
        if (typeof firstImage === 'string') {
            imageUrl = firstImage
        } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
            imageUrl = firstImage.url
        }
    }

    return (
        <Link
            href={`/listings/${listing.id}`}
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
