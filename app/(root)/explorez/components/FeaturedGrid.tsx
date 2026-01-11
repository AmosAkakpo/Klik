'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MdTrendingUp } from 'react-icons/md'

interface Listing {
    id: string
    title: string
    images: any[]
    price: number
    current_priority: number
}

export default function FeaturedGrid({ listings }: { listings: Listing[] }) {
    if (!listings || listings.length === 0) return null

    return (
        <section className="animate-fade-in-up delay-100">
            <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><MdTrendingUp className="text-xl" /></span>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Recommandés</h2>
                </div>
                {/* <button className="text-sm font-bold text-slate-500 hover:text-blue-400 transition-colors">Tout voir</button> */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listings.map((l, i) => (
                    <Link
                        href={`/explorez/${l.id}`}
                        key={l.id}
                        className={`group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10 ${i === 0 ? 'col-span-2 md:col-span-1 md:row-span-2 aspect-square' : 'aspect-[4/3]'}`}
                    >
                        {/* Image */}
                        {l.images?.[0] ? (
                            <Image
                                src={typeof l.images[0] === 'string' ? l.images[0] : (l.images[0] as any).url || null}
                                alt={l.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                <span className="text-neutral-600 text-xs font-bold">Sans Image</span>
                            </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                            <h3 className={`font-bold text-white leading-tight group-hover:text-blue-400 transition-colors ${i === 0 ? 'text-xl' : 'text-sm md:text-base'}`}>
                                {l.title}
                            </h3>
                            {l.price > 0 && (
                                <p className="text-xs font-bold text-slate-400 mt-1">{l.price.toLocaleString()} FCFA</p>
                            )}
                        </div>

                        {/* Premium Badge */}
                        {l.current_priority >= 20 && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-rose-500 text-white text-[10px] font-bold shadow-lg shadow-rose-500/20 backdrop-blur-md">
                                TOP
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    )
}
