'use client'

import { useState } from 'react'
import { MdSearch, MdMoreVert, MdRocketLaunch } from 'react-icons/md'

interface Listing {
    id: string
    title: string
    status: string
    created_at: string
    published_at: string
    view_count: number
    listing_price: number | null
    transactions: {
        amount: number
        status: string
        created_at: string
    } | null
    plans: {
        name: string
    } | null
    listing_boosts: {
        end_date: string
        is_active: boolean
    }[]
}

interface ListingsTableProps {
    listings: Listing[]
    role: 'super_admin' | 'manager'
}

export default function ListingsTable({ listings, role }: ListingsTableProps) {
    const [filter, setFilter] = useState('all')

    const filteredListings = listings.filter(item => {
        if (filter === 'all') return true

        // Calculate expiry
        const publishedDate = new Date(item.published_at)
        const expiryDate = new Date(publishedDate)
        expiryDate.setDate(publishedDate.getDate() + 30)
        const isExpired = new Date() > expiryDate

        if (filter === 'active') return item.status === 'active' && !isExpired
        if (filter === 'expired') return isExpired
        return true
    })

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-50 border-none text-sm text-slate-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actif</option>
                        <option value="expired">Expiré</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Annonce</th>
                            <th className="px-6 py-4">Plan & Paiement</th>
                            <th className="px-6 py-4">Publication</th>
                            <th className="px-6 py-4">Boost</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredListings.map((item) => {
                            const publishedDate = new Date(item.published_at)
                            const expiryDate = new Date(publishedDate)
                            expiryDate.setDate(publishedDate.getDate() + 30) // Default 30 days
                            const isExpired = new Date() > expiryDate

                            // Boost Logic
                            const activeBoost = item.listing_boosts?.find(b => b.is_active && new Date(b.end_date) > new Date())

                            return (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{item.title}</div>
                                        <div className="text-xs text-slate-400">ID: {item.id.slice(0, 8)}...</div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mr-2 ${imgPlanColor(item.plans?.name || 'Basic')
                                            }`}>
                                            {item.plans?.name || 'Basic'}
                                        </span>
                                        <div className="text-xs mt-1 font-medium text-slate-500">
                                            {item.transactions ? `${item.transactions.amount.toLocaleString()} FCFA` : 'Gratuit'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-slate-700 font-medium">
                                            {new Date(item.published_at).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Exp: {expiryDate.toLocaleDateString()}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        {activeBoost ? (
                                            <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                                                <MdRocketLaunch />
                                                Jusqu'au {new Date(activeBoost.end_date).toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 text-xs">-</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.status === 'active' && !isExpired ? (
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-green-50 text-green-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                Actif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                Expiré
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-white transition-all">
                                            <MdMoreVert className="text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}

                        {filteredListings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    Aucune annonce trouvée.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function imgPlanColor(name: string) {
    if (!name) return 'bg-slate-100 text-slate-600'
    switch (name.toLowerCase()) {
        case 'premium': return 'bg-violet-100 text-violet-700'
        case 'pro': return 'bg-blue-100 text-blue-700'
        default: return 'bg-slate-100 text-slate-600'
    }
}
