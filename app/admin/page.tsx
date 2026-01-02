import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MdEvent, MdPeople, MdTrendingUp, MdAttachMoney } from 'react-icons/md'
import RevenueChart from './components/RevenueChart'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: manager } = await supabase
        .from('managers')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = manager?.role || 'manager'
    const isSuper = role === 'super_admin'

    // --- FETCH STATS ---

    // 1. Listings Count
    let listingsQuery = supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active')
    if (!isSuper) listingsQuery = listingsQuery.eq('created_by', user.id)
    const { count: activeListings } = await listingsQuery

    // 2. Active Boosts
    let boostsQuery = supabase.from('listing_boosts').select('id', { count: 'exact', head: true }).eq('is_active', true)
    if (!isSuper) boostsQuery = boostsQuery.eq('created_by', user.id)
    const { count: activeBoosts } = await boostsQuery

    // 3. Total Revenue (Super Admin Only)
    let totalRevenue = 0
    let last7DaysRevenue = []

    if (isSuper) {
        // Fetch all completed transactions
        const { data: transactions } = await supabase
            .from('transactions')
            .select('amount, created_at')
            .eq('status', 'completed')

        if (transactions) {
            totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0)

            // Calculate last 7 days
            const today = new Date()
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today)
                d.setDate(today.getDate() - i)
                const dateStr = d.toISOString().split('T')[0]

                // Filter transactions for this day
                const daySum = transactions
                    .filter(t => t.created_at.startsWith(dateStr))
                    .reduce((sum, t) => sum + Number(t.amount), 0)

                last7DaysRevenue.push({ date: dateStr, amount: daySum })
            }
        }
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Tableau de Bord</h1>
                <p className="text-slate-500 mt-1">
                    Bienvenue, <span className="font-bold text-blue-600">{user.email}</span>
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:border-blue-100 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><MdEvent className="text-xl" /></div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Actifs</span>
                    </div>
                    <h3 className="text-slate-500 font-medium text-sm mb-1">Annonces</h3>
                    <p className="text-3xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{activeListings || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:border-orange-100 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-orange-100 text-orange-600"><MdTrendingUp className="text-xl" /></div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Boosts</span>
                    </div>
                    <h3 className="text-slate-500 font-medium text-sm mb-1">En cours</h3>
                    <p className="text-3xl font-black text-slate-800 group-hover:text-orange-500 transition-colors">{activeBoosts || 0}</p>
                </div>

                {/* Revenue Card (Super Admin) or Interactions (Manager) */}
                {isSuper ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:border-green-100 group lg:col-span-2">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-green-100 text-green-600"><MdAttachMoney className="text-xl" /></div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Total</span>
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm mb-1">Revenus Générés</h3>
                        <p className="text-3xl font-black text-slate-800 group-hover:text-green-600 transition-colors">
                            {totalRevenue.toLocaleString()} <span className="text-lg font-bold text-slate-400">FCFA</span>
                        </p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:border-violet-100 group lg:col-span-2">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-violet-100 text-violet-600"><MdPeople className="text-xl" /></div>
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm mb-1">Interactions</h3>
                        <p className="text-3xl font-black text-slate-800 group-hover:text-violet-600 transition-colors">-</p>
                    </div>
                )}
            </div>

            {/* Charts Section (Super Admin Only) */}
            {isSuper && last7DaysRevenue.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RevenueChart data={last7DaysRevenue} />
                    </div>

                    {/* Activity Feed / Notifications Placeholder */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Activité Récente</h3>
                        <div className="text-center py-10 text-slate-400 text-sm">
                            <p>Aucune nouvelle notification.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
