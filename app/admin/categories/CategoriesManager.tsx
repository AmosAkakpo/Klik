'use client'

import { useState } from 'react'
import { MdCategory, MdLabel, MdAdd, MdEdit, MdSave, MdClose, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { createCategory, updateCategory, createTag, updateTag } from './actions'

interface Category {
    id: string
    name: string
    slug: string
    icon: string
    display_order: number
    is_active: boolean
}

interface Tag {
    id: string
    name: string
    slug: string
    is_active: boolean
}

export default function CategoriesManager({ categories, tags }: { categories: Category[], tags: Tag[] }) {
    const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    // Helper to toggle Forms
    const reset = () => {
        setEditingId(null)
        setIsCreating(false)
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Gestion du Contenu</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`pb-3 px-4 font-bold flex items-center gap-2 transition-all ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    <MdCategory className="text-xl" /> Catégories ({categories.length})
                </button>
                <button
                    onClick={() => setActiveTab('tags')}
                    className={`pb-3 px-4 font-bold flex items-center gap-2 transition-all ${activeTab === 'tags' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    <MdLabel className="text-xl" /> Tags ({tags.length})
                </button>
            </div>

            {/* ACTION BAR */}
            <div className="flex justify-end">
                {!isCreating && !editingId && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-500 transition-all"
                    >
                        <MdAdd /> Ajouter {activeTab === 'categories' ? 'une Catégorie' : 'un Tag'}
                    </button>
                )}
            </div>

            {/* CREATE FORM */}
            {isCreating && (
                <div className="bg-slate-50 p-6 rounded-xl border border-blue-200 animate-slide-in-right">
                    <form action={async (formData) => {
                        if (activeTab === 'categories') await createCategory(formData)
                        else await createTag(formData)
                        reset()
                    }} className="flex flex-col md:flex-row gap-4 items-end">

                        <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                            <input name="name" required placeholder="Ex: Restaurant" className="w-full p-2 rounded-lg border border-slate-300" />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Slug (URL)</label>
                            <input name="slug" required placeholder="Ex: restaurant" className="w-full p-2 rounded-lg border border-slate-300" />
                        </div>

                        {activeTab === 'categories' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Emoji/Icône</label>
                                    <input name="icon" placeholder="🍔" className="w-20 p-2 rounded-lg border border-slate-300 text-center" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Ordre</label>
                                    <input name="display_order" type="number" defaultValue={0} className="w-20 p-2 rounded-lg border border-slate-300 text-center" />
                                </div>
                            </>
                        )}

                        <div className="flex gap-2 pb-1">
                            <button type="button" onClick={reset} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg"><MdClose /></button>
                            <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 shadow"><MdSave /></button>
                        </div>
                    </form>
                </div>
            )}

            {/* LIST */}
            <div className="grid grid-cols-1 gap-4">
                {(activeTab === 'categories' ? categories : tags).map((item) => {
                    const isEditing = editingId === item.id

                    if (isEditing) {
                        return (
                            <form key={item.id} action={async (formData) => {
                                if (activeTab === 'categories') await updateCategory(item.id, formData)
                                else await updateTag(item.id, formData)
                                reset()
                            }} className="bg-white p-4 rounded-xl border-2 border-blue-500 shadow-md flex flex-col md:flex-row gap-4 items-center">
                                {/* Hidden ID */}
                                <input type="hidden" name="id" value={item.id} />

                                <div className="flex-1 w-full">
                                    <input name="name" defaultValue={item.name} className="w-full p-2 font-bold border-b border-slate-200 focus:outline-none focus:border-blue-500" />
                                </div>

                                {activeTab === 'categories' && (
                                    <>
                                        <input name="icon" defaultValue={(item as Category).icon} className="w-16 p-2 text-center border-b border-slate-200" />
                                        <input name="display_order" type="number" defaultValue={(item as Category).display_order} className="w-16 p-2 text-center border-b border-slate-200" />
                                    </>
                                )}

                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1 cursor-pointer select-none text-sm text-slate-500">
                                        <input name="is_active" type="checkbox" defaultChecked={item.is_active} className="rounded text-blue-600 focus:ring-blue-500" />
                                        Visible
                                    </label>
                                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
                                    <button type="button" onClick={reset} className="p-2 text-slate-400 hover:text-slate-600"><MdClose /></button>
                                    <button type="submit" className="p-2 text-green-600 hover:bg-green-50 rounded"><MdSave className="text-xl" /></button>
                                </div>
                            </form>
                        )
                    }

                    return (
                        <div key={item.id} className={`bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all ${!item.is_active ? 'opacity-60 bg-slate-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                {activeTab === 'categories' && (
                                    <span className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full">{(item as Category).icon}</span>
                                )}
                                <div>
                                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                                    <p className="text-xs text-slate-400 font-mono">{(item as Category).slug || (item as Tag).slug}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {!item.is_active && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                        <MdVisibilityOff /> Masqué
                                    </span>
                                )}
                                {activeTab === 'categories' && (
                                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">Ordre: {(item as Category).display_order}</span>
                                )}
                                <button onClick={() => setEditingId(item.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                    <MdEdit className="text-xl" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
