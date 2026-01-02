import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function AccountPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: manager } = await supabase
        .from('managers')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!manager) {
        return <div>Erreur de chargement du profil.</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Mon Compte</h1>
                <p className="text-slate-500 mt-1">Gérez vos informations personnelles.</p>
            </div>

            <ProfileForm manager={manager} />
        </div>
    )
}
