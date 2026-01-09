'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { MdAdd, MdEdit, MdDelete, MdLocationOn, MdPublic, MdCheck, MdClose } from 'react-icons/md'

export default function AdminLocationsPage() {
    const supabase = createClient()
    const [countries, setCountries] = useState<any[]>([])
    const [cities, setCities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

    // Modal State
    const [isCountryModalOpen, setIsCountryModalOpen] = useState(false)
    const [isCityModalOpen, setIsCityModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any | null>(null)

    // Form State
    const [formData, setFormData] = useState({ name: '', code: '', country_id: '' })

    const fetchData = async () => {
        setLoading(true)
        const { data: c } = await supabase.from('countries').select('*').order('name')
        const { data: ct } = await supabase.from('cities').select('*').order('display_order')

        if (c) setCountries(c)
        if (ct) setCities(ct)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSaveCountry = async () => {
        if (!formData.name || !formData.code) return

        const data = {
            name: formData.name,
            code: formData.code.toUpperCase(),
            is_active: true
        }

        if (editingItem) {
            await supabase.from('countries').update(data).eq('id', editingItem.id)
        } else {
            await supabase.from('countries').insert(data)
        }

        setIsCountryModalOpen(false)
        setEditingItem(null)
        setFormData({ name: '', code: '', country_id: '' })
        fetchData()
    }

    const handleSaveCity = async () => {
        if (!formData.name || !formData.country_id) return

        const data = {
            name: formData.name,
            country_id: formData.country_id,
            is_active: true
        }

        if (editingItem) {
            await supabase.from('cities').update(data).eq('id', editingItem.id)
        } else {
            // Get max display_order
            const { data: maxOrder } = await supabase
                .from('cities')
                .select('display_order')
                .eq('country_id', formData.country_id)
                .order('display_order', { ascending: false })
                .limit(1)
                .single()

            const nextOrder = (maxOrder?.display_order || 0) + 1
            await supabase.from('cities').insert({ ...data, display_order: nextOrder })
        }

        setIsCityModalOpen(false)
        setEditingItem(null)
        setFormData({ name: '', code: '', country_id: '' })
        fetchData()
    }

    const handleDelete = async (table: 'countries' | 'cities', id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return
        await supabase.from(table).delete().eq('id', id)
        fetchData()
    }

    const toggleActive = async (table: 'countries' | 'cities', item: any) => {
        await supabase.from(table).update({ is_active: !item.is_active }).eq('id', item.id)
        fetchData()
    }

    return (
        <div className="p-8 space-y-8 text-slate-700 bg-slate-50">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Gestion des Lieux 🌍</h1>

            {/* COUNTRIES SECTION */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MdPublic className="text-blue-500" />
                        Pays ({countries.length})
                    </h2>
                    <button
                        onClick={() => {
                            setEditingItem(null)
                            setFormData({ name: '', code: '', country_id: '' })
                            setIsCountryModalOpen(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
                    >
                        <MdAdd /> Ajouter Pays
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countries.map(country => (
                        <div key={country.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:border-blue-300 transition">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{country.name}</h3>
                                <p className="text-xs text-slate-600 font-mono bg-slate-200 px-2 py-1 rounded inline-block mt-1">{country.code}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => toggleActive('countries', country)} className={`p-2 rounded-lg ${country.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {country.is_active ? <MdCheck /> : <MdClose />}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingItem(country)
                                        setFormData({ name: country.name, code: country.code, country_id: '' })
                                        setIsCountryModalOpen(true)
                                    }}
                                    className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700"
                                >
                                    <MdEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete('countries', country.id)}
                                    className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CITIES SECTION */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MdLocationOn className="text-emerald-500" />
                        Villes ({cities.length})
                    </h2>
                    <button
                        onClick={() => {
                            setEditingItem(null)
                            setFormData({ name: '', code: '', country_id: countries[0]?.id || '' })
                            setIsCityModalOpen(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-xl hover:bg-emerald-700 transition"
                    >
                        <MdAdd /> Ajouter Ville
                    </button>
                </div>

                {/* Filter by Country Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCountry(null)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${!selectedCountry ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                    >
                        Tous
                    </button>
                    {countries.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCountry(c.id)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${selectedCountry === c.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cities
                        .filter(city => !selectedCountry || city.country_id === selectedCountry)
                        .map(city => {
                            const country = countries.find(c => c.id === city.country_id)
                            return (
                                <div key={city.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 group hover:border-emerald-400 transition shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{country?.code}</span>
                                        <div className="flex gap-1 opacity-10 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(city)
                                                    setFormData({ name: city.name, code: '', country_id: city.country_id })
                                                    setIsCityModalOpen(true)
                                                }}
                                                className="p-1 hover:text-blue-400"
                                            >
                                                <MdEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete('cities', city.id)}
                                                className="p-1 hover:text-red-400"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">{city.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => toggleActive('cities', city)}
                                            className={`text-xs px-2 py-1 rounded bg-slate-200 ${city.is_active ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {city.is_active ? 'Actif' : 'Inactif'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </section>

            {/* MODALS */}
            {isCountryModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-slate-900">{editingItem ? 'Modifier Pays' : 'Ajouter Pays'}</h3>
                        <div className="space-y-4">
                            <input
                                className="w-full bg-slate-50 p-3 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nom du pays (ex: Bénin)"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                className="w-full bg-slate-50 p-3 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Code (ex: BJ)"
                                maxLength={3}
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                            />
                            <div className="flex gap-2 justify-end mt-6">
                                <button onClick={() => setIsCountryModalOpen(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900">Annuler</button>
                                <button onClick={handleSaveCountry} className="px-6 py-2 bg-blue-600 rounded-lg font-bold">Sauvegarder</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isCityModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-slate-900">{editingItem ? 'Modifier Ville' : 'Ajouter Ville'}</h3>
                        <div className="space-y-4">
                            <input
                                className="w-full bg-slate-50 p-3 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nom de la ville"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <select
                                className="w-full bg-slate-50 p-3 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                value={formData.country_id}
                                onChange={e => setFormData({ ...formData, country_id: e.target.value })}
                            >
                                <option value="">Choisir un pays</option>
                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="flex gap-2 justify-end mt-6">
                                <button onClick={() => setIsCityModalOpen(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900">Annuler</button>
                                <button onClick={handleSaveCity} className="px-6 py-2 bg-emerald-600 rounded-lg font-bold">Sauvegarder</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
