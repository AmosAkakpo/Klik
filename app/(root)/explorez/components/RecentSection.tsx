import React from 'react'
import { MdTrendingUp } from 'react-icons/md'
import ListingCard from './ListingCard'

interface RecentSectionProps {
    listings: any[]
}

const RecentSection = ({ listings }: RecentSectionProps) => {
    if (!listings || listings.length === 0) return null

    return (
        <section className="animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-4 px-1">
                <MdTrendingUp className="text-rose-500 text-xl" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Nouveautés
                </h2>
            </div>

            <div className="relative group">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {listings.map((listing, index) => (
                        <div
                            key={listing.id}
                            className="min-w-[280px] md:min-w-[320px] snap-start"
                        >
                            <ListingCard
                                listing={listing}
                            />
                        </div>
                    ))}
                </div>

                {/* Gradient fades for scroll hints */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none md:hidden" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none md:hidden" />
            </div>
        </section>
    )
}

export default RecentSection
