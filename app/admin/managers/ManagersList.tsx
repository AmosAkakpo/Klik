'use client'

import { useState } from 'react'
import { MdPerson, MdCheckCircle, MdBlock, MdShield, MdMoreVert } from 'react-icons/md'
import { toggleManagerStatus, updateManagerRole } from './actions'

interface Manager {
    id: string
    full_name: string
    email: string
    role: string
    is_active: boolean
    created_at: string
}

export default function ManagersList({ managers }: { managers: Manager[] }) {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        if (!confirm(currentStatus ? 'Voulez-vous suspendre ce compte ?' : 'Voulez-vous réactiver ce compte ?')) return

        setLoadingMap(prev => ({ ...prev, [id]: true }))
        await toggleManagerStatus(id, currentStatus)
        setLoadingMap(prev => ({ ...prev, [id]: false }))
    }

    const handleRoleChange = async (id: string, currentRole: string) => {
        const newRole = currentRole === 'manager' ? 'super_admin' : 'manager'
        if (!confirm(`Passer ce compte en ${newRole === 'super_admin' ? 'Super Admin' : 'Manager simple'} ?`)) return

        setLoadingMap(prev => ({ ...prev, [id]: true }))
        await updateManagerRole(id, newRole as 'super_admin' | 'manager')
        setLoadingMap(prev => ({ ...prev, [id]: false }))
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Utilisateur</th>
                            <th className="px-6 py-4">Rôle</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Date d'inscription</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {managers.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                            {m.full_name?.charAt(0) || <MdPerson />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{m.full_name || 'Sans Nom'}</div>
                                            <div className="text-xs text-slate-400">{m.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleRoleChange(m.id, m.role)}
                                        disabled={loadingMap[m.id]}
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${m.role === 'super_admin'
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}
                                    >
                                        {m.role === 'super_admin' && <MdShield />}
                                        {m.role === 'super_admin' ? 'Super Admin' : 'Manager'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    {m.is_active ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                                            <MdCheckCircle /> Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-rose-600 text-xs font-bold bg-rose-50 px-2 py-1 rounded">
                                            <MdBlock /> Suspendu
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(m.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleToggleStatus(m.id, m.is_active)}
                                        disabled={loadingMap[m.id]}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${m.is_active
                                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                    >
                                        {loadingMap[m.id] ? '...' : (m.is_active ? 'Suspendre' : 'Activer')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
