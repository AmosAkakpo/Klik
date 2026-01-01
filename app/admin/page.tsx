import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MdTrendingUp, MdEmail, MdPeople, MdEvent } from 'react-icons/md'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch some real stats later. For now, placeholders but structured nicely.
    const stats = [
        { title: 'Annonces Actives', value: '12', icon: MdEvent, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Vues Totales', value: '1,234', icon: MdPeople, color: 'text-violet-600', bg: 'bg-violet-100' },
        { title: 'Clics Contact', value: '89', icon: MdEmail, color: 'text-rose-600', bg: 'bg-rose-100' },
        { title: 'Boosts Actifs', value: '3', icon: MdTrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-slate-500 mt-1">Bienvenue, {user.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-6 gap-6">
                <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Activité Récente</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-slate-700">Nouvelle annonce ajoutée</p>
                                    <p className="text-xs text-slate-400">Il y a 2 heures</p>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">Succès</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-2 bg-gradient-to-br from-blue-600 to-violet-700 p-6 rounded-2xl text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Besoin d'aide ?</h3>
                        <p className="text-blue-100 text-sm mb-6">Contactez le support technique si vous rencontrez des problèmes.</p>
                    </div>
                    <button className="bg-white text-blue-600 py-2 px-4 rounded-xl font-bold text-sm w-full hover:bg-blue-50 transition-colors">
                        Contacter Support
                    </button>
                </div>
            </div>
        </div>
    )
}
