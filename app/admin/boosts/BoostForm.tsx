'use client'

import { useState } from 'react'
import { MdRocketLaunch, MdAccessTime, MdAttachMoney, MdPayment } from 'react-icons/md'
import { createBoost } from './actions'

interface Listing {
    id: string
    title: string
    plans: {
        slug: string
    }
}

// Fixed boost price for now, or could come from DB if needed
const BOOST_PRICE_PER_DAY = 500 // FCFA (This might change if user wants configurability, but sticking to basics for now)

export default function BoostPage({ listings }: { listings: Listing[] }) {
    const [selectedListing, setSelectedListing] = useState('')
    const [duration, setDuration] = useState(1) // Default 24h
    const [loading, setLoading] = useState(false)

    // Filter only Premium listings
    // Check if plans exists, handle potential null/undefined
    // @ts-ignore
    const premiumListings = listings.filter(l => l.plans?.slug === 'premium')

    const totalPrice = duration * BOOST_PRICE_PER_DAY

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Booster une Annonce</h1>
                <p className="text-slate-500 mt-1">
                    Augmentez la visibilité de vos événements en les plaçant en tête de liste.
                    <br />
                    <span className="text-orange-500 font-medium text-sm">Note: Seules les annonces Premium peuvent être boostées.</span>
                </p>
            </div>

            <form action={async (formData) => {
                setLoading(true)
                formData.set('amount', totalPrice.toString())
                await createBoost(formData)
                setLoading(false)
            }} className="space-y-6">

                {/* 1. Selection & Configuration */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MdRocketLaunch className="text-orange-500" /> Configuration
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Choisir l'annonce à booster (Premium Uniquement)</label>
                            <div className="relative">
                                <select
                                    name="listing_id"
                                    required
                                    value={selectedListing}
                                    onChange={(e) => setSelectedListing(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
                                >
                                    <option value="">Sélectionner une annonce...</option>
                                    {premiumListings.map(l => (
                                        <option key={l.id} value={l.id}>{l.title}</option>
                                    ))}
                                </select>
                            </div>
                            {premiumListings.length === 0 && (
                                <p className="text-xs text-rose-500 mt-2 font-medium">
                                    Aucune annonce Premium trouvée. Veuillez d'abord créer ou mettre à niveau une annonce vers le plan Premium.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Durée</label>
                            <div className="relative">
                                <MdAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    name="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                >
                                    <option value="1">24 Heures</option>
                                    <option value="2">48 Heures</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Coût Total</label>
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100">
                                <MdAttachMoney className="text-xl" />
                                {totalPrice.toLocaleString()} FCFA
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Payment */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MdPayment className="text-slate-600" /> Paiement
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Moyen de Paiement</label>
                            <select name="payment_method" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
                                <option value="MTN Mobile Money">MTN Mobile Money</option>
                                <option value="Moov Money">Moov Money</option>
                                <option value="Espèces">Espèces</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Référence Transaction</label>
                            <input name="payment_reference" required type="text" placeholder="ID Transaction..."
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={loading || !selectedListing}
                        type="submit"
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <MdRocketLaunch />
                        {loading ? 'Activation...' : 'Activer le Boost'}
                    </button>
                </div>

            </form>
        </div>
    )
}
