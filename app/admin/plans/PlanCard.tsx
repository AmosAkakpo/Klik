'use client'

import { useState } from 'react'
import { MdCheck, MdEdit, MdSave, MdClose, MdVideocam, MdPhotoLibrary, MdAttachMoney } from 'react-icons/md'
import { updatePlan } from './actions'

interface Plan {
    id: string
    name: string
    slug: string
    price: number
    max_images: number
    video_allowed: boolean
    priority_level: number
    is_active: boolean
}

export default function PlanCard({ plan }: { plan: Plan }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    // Using form action directly on the form element
    // But we need to handle the "Edit mode" toggle
    // So we'll wrap the form inputs

    return (
        <div className={`bg-white rounded-2xl shadow-sm border transition-all ${plan.slug === 'premium' ? 'border-violet-200 shadow-violet-100' :
            plan.slug === 'pro' ? 'border-blue-200 shadow-blue-100' : 'border-slate-100'
            }`}>
            <div className={`p-4 rounded-t-2xl border-b ${plan.slug === 'premium' ? 'bg-violet-50 border-violet-100' :
                plan.slug === 'pro' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'
                }`}>
                <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-bold ${plan.slug === 'premium' ? 'text-violet-700' :
                        plan.slug === 'pro' ? 'text-blue-700' : 'text-slate-700'
                        }`}>
                        {plan.name}
                    </h3>
                    <div className="flex gap-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {plan.is_active ? 'Actif' : 'Inactif'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {!isEditing ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="p-2 bg-slate-100 rounded-lg"><MdAttachMoney /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Prix</p>
                                <p className="font-bold text-xl">{plan.price.toLocaleString()} FCFA</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="p-2 bg-slate-100 rounded-lg"><MdPhotoLibrary /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Images Max</p>
                                <p className="font-bold">{plan.max_images} Photos</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="p-2 bg-slate-100 rounded-lg"><MdVideocam /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Vidéo</p>
                                <p className="font-bold">{plan.video_allowed ? 'Autorisée' : 'Non incluse'}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full mt-4 py-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium transition-colors"
                        >
                            <MdEdit /> Modifier le plan
                        </button>
                    </div>
                ) : (
                    <form
                        action={async (formData) => {
                            setLoading(true)
                            await updatePlan(formData)
                            setLoading(false)
                            setIsEditing(false)
                        }}
                        className="space-y-4"
                    >
                        <input type="hidden" name="id" value={plan.id} />

                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Prix (FCFA)</label>
                            <input name="price" type="number" defaultValue={plan.price} required
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Images Max</label>
                                <input name="max_images" type="number" defaultValue={plan.max_images} required
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Priorité</label>
                                <input name="priority_level" type="number" defaultValue={plan.priority_level} required
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input name="video_allowed" type="checkbox" defaultChecked={plan.video_allowed} className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm font-medium text-slate-700">Vidéo incluse</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input name="is_active" type="checkbox" defaultChecked={plan.is_active} className="w-4 h-4 text-green-600 rounded" />
                                <span className="text-sm font-medium text-slate-700">Actif</span>
                            </label>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-medium shadow-lg shadow-blue-900/20"
                            >
                                {loading ? '...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
