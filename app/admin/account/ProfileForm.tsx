'use client'

import { useState } from 'react'
import { MdPerson, MdEmail, MdShield, MdSave, MdCheckCircle } from 'react-icons/md'
import { updateProfile } from './actions'

interface Manager {
    full_name: string
    email: string
    role: string
    created_at: string
}

export default function ProfileForm({ manager }: { manager: Manager }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setMessage(null)

        const result = await updateProfile(formData)

        setLoading(false)
        if (result?.error) {
            setMessage(`❌ ${result.error}`)
        } else {
            setMessage('✅ Profil mis à jour')
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                        {manager.full_name?.charAt(0).toUpperCase() || <MdPerson />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{manager.full_name}</h2>
                        <p className="text-slate-500 flex items-center gap-1">
                            <MdShield className={manager.role === 'super_admin' ? 'text-purple-500' : 'text-slate-400'} />
                            {manager.role === 'super_admin' ? 'Super Administrateur' : 'Manager'}
                        </p>
                    </div>
                </div>
            </div>

            <form action={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nom Complet</label>
                        <div className="relative">
                            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                            <input
                                name="full_name"
                                type="text"
                                defaultValue={manager.full_name}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <div className="relative">
                            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                            <input
                                type="email"
                                value={manager.email}
                                disabled
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed font-medium"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1 pl-1">L'adresse email ne peut pas être modifiée.</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-center font-bold ${message.includes('❌') ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600'}`}>
                        {message}
                    </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        disabled={loading}
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enregistrement...' : <><MdSave /> Enregistrer</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
