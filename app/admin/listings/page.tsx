import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MdAdd } from 'react-icons/md'
import ListingsTable from './ListingsTable'

export default async function ListingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: manager } = await supabase
        .from('managers')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = manager?.role || 'manager'

    let query = supabase
        .from('listings')
        .select(`
            id, 
            title, 
            status, 
            created_at, 
            published_at, 
            price,
            plans ( name ),
            transactions ( amount, status, created_at ),
            listing_boosts ( end_date, is_active )
        `)
        .order('created_at', { ascending: false })

    if (role !== 'super_admin') {
        query = query.eq('created_by', user.id)
    }

    const { data: listings } = await query

    const formattedListings = listings?.map(l => ({
        id: l.id,
        title: l.title,
        status: l.status,
        created_at: l.created_at,
        published_at: l.published_at,
        view_count: 0,
        listing_price: l.price,
        // @ts-ignore
        plans: l.plans,
        // @ts-ignore
        transactions: l.transactions,
        // @ts-ignore
        listing_boosts: l.listing_boosts || []
    })) || []


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Annonces</h1>
                    <p className="text-slate-500 mt-1">
                        {role === 'super_admin'
                            ? 'Vue globale de toutes les annonces de la plateforme.'
                            : 'Gérez vos événements et services publiés.'}
                    </p>
                </div>
                <Link
                    href="/admin/listings/new"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all hover:-translate-y-1"
                >
                    <MdAdd className="text-xl" /> Créer une annonce
                </Link>
            </div>

            {/* @ts-ignore */}
            <ListingsTable listings={formattedListings} role={role} />
        </div>
    )
}
