import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CategoriesManager from './CategoriesManager'

export default async function CategoriesPage() {
    const supabase = await createClient()

    // 1. Super Admin Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) {
        return (
            <div className="p-8 text-center bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
                <h2 className="font-bold text-xl mb-2">Accès Refusé</h2>
                <p>Seuls les Super Admins peuvent gérer la configuration du système.</p>
            </div>
        )
    }

    // 2. Fetch Data
    const { data: categories } = await supabase.from('categories').select('*').order('display_order')
    const { data: tags } = await supabase.from('tags').select('*').order('name')

    return <CategoriesManager categories={categories || []} tags={tags || []} />
}
