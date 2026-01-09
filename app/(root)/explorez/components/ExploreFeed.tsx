'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import ListingCard from './ListingCard'
import { MdArrowUpward } from 'react-icons/md'
import { FilterState } from './FilterDrawer'

interface ExploreFeedProps {
    searchQuery: string
    filters: FilterState
}

export default function ExploreFeed({ searchQuery, filters }: ExploreFeedProps) {
    const supabase = createClient()
    const [listings, setListings] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [showScrollTop, setShowScrollTop] = useState(false)

    // Show/hide scroll to top button based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const fetchPage = async (pageTarget: number) => {
        if (loading || !hasMore) return

        setLoading(true)
        console.log(`Fetching feed page ${pageTarget}...`)

        const { data, error } = await supabase.rpc('get_explore_feed', {
            page_number: pageTarget,
            page_size: 6,
            filter_city: filters.city || null,
            filter_category: filters.category || null
        })

        if (error) {
            console.error('Feed Error Details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                full: error
            })
            setLoading(false)
            return
        }

        console.log('Feed data received:', data?.length || 0, 'items')

        if (data && data.length > 0) {
            // Apply client-side filters for search and price
            let filteredData = data

            // Search filter
            if (searchQuery) {
                filteredData = filteredData.filter((item: any) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.location_city?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            }

            // Price filters
            if (filters.minPrice) {
                filteredData = filteredData.filter((item: any) =>
                    item.price >= parseInt(filters.minPrice)
                )
            }
            if (filters.maxPrice) {
                filteredData = filteredData.filter((item: any) =>
                    item.price <= parseInt(filters.maxPrice)
                )
            }

            setListings(prev => [...prev, ...filteredData])
            if (data.length < 6) setHasMore(false)
        } else {
            setHasMore(false)
        }

        setLoading(false)
    }

    // Reset and fetch when filters or search changes
    useEffect(() => {
        setListings([])
        setPage(1)
        setHasMore(true)
        fetchPage(1)
    }, [searchQuery, filters])

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item, index) => (
                    <div key={`listing-${item.id}-${index}`} className="animate-fade-in-up" style={{ animationDelay: `${(index % 6) * 100}ms` }}>
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

            {/* Manual Load More Button */}
            {!loading && hasMore && (
                <div className="text-center py-8">
                    <button
                        onClick={() => {
                            const nextPage = page + 1
                            setPage(nextPage)
                            fetchPage(nextPage)
                        }}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 border border-blue-400/20"
                    >
                        Charger plus d'annonces
                    </button>
                    <p className="text-slate-600 text-xs mt-3 font-medium">📊 Économie de données activée</p>
                </div>
            )}

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

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-900/50 transition-all hover:scale-110 active:scale-95 border border-blue-400/20 animate-fade-in-up"
                    aria-label="Retour en haut"
                >
                    <MdArrowUpward className="text-2xl" />
                </button>
            )}
        </div>
    )
}
