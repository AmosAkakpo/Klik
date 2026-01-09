'use client'

import Image from 'next/image'
import { useState } from 'react'
import { MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md'

interface ListingHeroProps {
    images: any[]
    title: string
}

// Helper to optimize and extract image URLs
function getImageUrl(img: any): string | null {
    if (!img) return null
    const url = typeof img === 'string' ? img : img.url
    if (!url) return null

    // Optimize for detail page (larger than cards)
    if (url.includes('unsplash.com')) {
        return `${url}&w=800&q=80&auto=format`
    }
    if (url.includes('picsum.photos')) {
        return url.replace(/\/\d+\/\d+/, '/800/600')
    }
    if (url.includes('supabase.co')) {
        return `${url}?width=800&quality=80`
    }
    return url
}

export default function ListingHero({ images, title }: ListingHeroProps) {
    const [showGallery, setShowGallery] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const imageUrls = Array.isArray(images)
        ? images.map(getImageUrl).filter(Boolean) as string[]
        : []

    const mainImage = imageUrls[0] || null

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
    }

    return (
        <>
            {/* Hero Image */}
            <div className="relative aspect-[16/10] md:aspect-[21/9] bg-neutral-900">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <p className="font-bold">Aucune image</p>
                    </div>
                )}

                {/* Image Counter Badge */}
                {imageUrls.length > 1 && (
                    <button
                        onClick={() => setShowGallery(true)}
                        className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 backdrop-blur text-white rounded-full text-sm font-bold hover:bg-black/90 transition-all border border-white/20"
                    >
                        📷 {imageUrls.length} photos
                    </button>
                )}
            </div>

            {/* Full-Screen Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowGallery(false)}
                        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
                    >
                        <MdClose className="text-2xl" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 backdrop-blur text-white rounded-full text-sm font-bold z-10">
                        {currentIndex + 1} / {imageUrls.length}
                    </div>

                    {/* Main Image */}
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <Image
                            src={imageUrls[currentIndex]}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {imageUrls.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                            >
                                <MdChevronLeft className="text-3xl" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                            >
                                <MdChevronRight className="text-3xl" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    )
}
