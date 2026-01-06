'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { createClient } from '@/utils/supabase/client'
import ListingCard from './ListingCard'

export default function ExploreFeed() {
    const supabase = createClient()
    const [listings, setListings] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const { ref, inView } = useInView()

    const fetchPage = async (pageTarget: number) => {
        if (loading || !hasMore) return

        setLoading(true)
        setPage(pageTarget)
        console.log(`Fetching feed page ${pageTarget}...`)

        const { data, error } = await supabase.rpc('get_explore_feed', {
            page_number: pageTarget,
            page_size: 9
        })

        if (error) {
            console.error('Feed Error:', error)
            setLoading(false)
            return
        }

        if (data && data.length > 0) {
            setListings(prev => [...prev, ...data])
            if (data.length < 9) setHasMore(false)
        } else {
            setHasMore(false)
        }

        setLoading(false)
    }

    // Initial Load
    useEffect(() => {
        fetchPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Next Page on Scroll
    useEffect(() => {
        if (inView && !loading && hasMore) {
            fetchPage(page + 1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, loading, hasMore])

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item, index) => (
                    <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 6) * 100}ms` }}>
                        <ListingCard listing={item} />
                    </div>
                ))}
            </div>

            {/* Skeleton / Loading State */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/5] bg-neutral-900/50 rounded-3xl animate-pulse border border-white/5" />
                    ))}
                </div>
            )}

            {/* End of Feed / Sentinel */}
            {!loading && hasMore && <div ref={ref} className="h-10" />}

            {!hasMore && listings.length > 0 && (
                <div className="text-center py-10">
                    <p className="text-slate-500 font-medium italic">Vous avez exploré toutes les offres du moment ! ✨</p>
                </div>
            )}

            {!loading && listings.length === 0 && !hasMore && (
                <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Pas d'annonces disponibles</p>
                </div>
            )}
        </div>
    )
}
