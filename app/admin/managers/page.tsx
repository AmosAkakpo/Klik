import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ManagersList from './ManagersList'

export default async function ManagersPage() {
    const supabase = await createClient()

    // 1. Super Admin Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) {
        return (
            <div className="p-8 text-center bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
                <h2 className="font-bold text-xl mb-2">Accès Refusé</h2>
                <p>Seuls les Super Admins peuvent gérer les utilisateurs.</p>
            </div>
        )
    }

    // 2. Fetch All Managers
    // Need to select is_active (we added it recently)
    const { data: managers } = await supabase
        .from('managers')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Utilisateurs</h1>
                <p className="text-slate-500 mt-1">Gérez les accès et les rôles des membres de la plateforme.</p>
            </div>

            {/* @ts-ignore - 'is_active' column might be typed optionally or missing in old generated types, we ignore for now */}
            <ManagersList managers={managers || []} />
        </div>
    )
}
