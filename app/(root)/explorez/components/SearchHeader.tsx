'use client'

import { useState } from 'react'
import { MdSearch, MdFilterList, MdClose } from 'react-icons/md'

interface SearchHeaderProps {
    onSearch: (query: string) => void
    onFilterOpen: () => void
}

export default function SearchHeader({ onSearch, onFilterOpen }: SearchHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(searchQuery)
    }

    return (
        <div className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 p-4">
            <form onSubmit={handleSearch} className="flex gap-3 max-w-5xl mx-auto">
                <div className="relative flex-1 group">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors text-xl" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher (Ex: Concert, Restaurant...)"
                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-neutral-900 border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-medium placeholder:text-slate-600 transition-all text-white shadow-inner"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('')
                                onSearch('')
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                            <MdClose className="text-xl" />
                        </button>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onFilterOpen}
                    className="p-3.5 bg-neutral-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-neutral-800 hover:border-white/10 transition-all shadow-lg shadow-black/20 active:scale-95"
                >
                    <MdFilterList className="text-xl" />
                </button>
            </form>
        </div>
    )
}
