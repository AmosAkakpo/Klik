import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PlanCard from './PlanCard'

export default async function PlansPage() {
    const supabase = await createClient()

    // 1. Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: manager } = await supabase
        .from('managers')
        .select('role')
        .eq('id', user.id)
        .single()

    if (manager?.role !== 'super_admin') {
        return (
            <div className="p-8 text-center text-rose-500">
                <h1 className="text-2xl font-bold">Accès Refusé</h1>
                <p>Cette page est réservée aux Super Administrateurs.</p>
            </div>
        )
    }

    // 2. Fetch Plans
    const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true })

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Plans</h1>
                <p className="text-slate-500 mt-1">
                    Configurez les offres, prix et limites. Ces changements affectent les nouvelles annonces.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans?.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </div>
        </div>
    )
}
