'use client'

import { useState } from 'react'
import { MdClose, MdLocationOn, MdCategory, MdAttachMoney } from 'react-icons/md'

interface FilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    onApplyFilters: (filters: FilterState) => void
    categories: { id: string; name: string; slug: string }[]
}

export interface FilterState {
    city: string
    category: string
    minPrice: string
    maxPrice: string
}

const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Ouidah', 'Bohicon']

export default function FilterDrawer({ isOpen, onClose, onApplyFilters, categories }: FilterDrawerProps) {
    const [filters, setFilters] = useState<FilterState>({
        city: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    })

    const handleApply = () => {
        onApplyFilters(filters)
        onClose()
    }

    const handleReset = () => {
        const resetFilters = { city: '', category: '', minPrice: '', maxPrice: '' }
        setFilters(resetFilters)
        onApplyFilters(resetFilters)
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-x-0 bottom-0 md:right-0 md:left-auto md:top-0 md:w-96 bg-neutral-900 z-50 rounded-t-3xl md:rounded-none border-t md:border-l border-white/10 shadow-2xl animate-slide-up md:animate-slide-left">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Filtres</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <MdClose className="text-2xl text-slate-400" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 space-y-6 max-h-[70vh] md:max-h-[calc(100vh-180px)] overflow-y-auto">

                    {/* City Filter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                            <MdLocationOn className="text-blue-500" />
                            Ville
                        </label>
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        >
                            <option value="">Toutes les villes</option>
                            {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                            <MdCategory className="text-blue-500" />
                            Catégorie
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        >
                            <option value="">Toutes les catégories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                            <MdAttachMoney className="text-blue-500" />
                            Prix (FCFA)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                className="px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                className="px-4 py-3 rounded-xl bg-neutral-800 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-white/10 flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-all border border-white/10"
                    >
                        Réinitialiser
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-900/30"
                    >
                        Appliquer
                    </button>
                </div>
            </div>
        </>
    )
}
