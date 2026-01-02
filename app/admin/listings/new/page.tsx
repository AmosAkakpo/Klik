import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ListingForm from './ListingForm'

export default async function NewListingPage() {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Fetch Data (Parallel)
    const [categoriesResult, tagsResult, plansResult] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('display_order'),
        supabase.from('tags').select('id, name').eq('is_active', true).order('name'),
        supabase.from('plans').select('*').eq('is_active', true).order('price')
    ])

    const categories = categoriesResult.data || []
    const tags = tagsResult.data || []
    const plans = plansResult.data || []

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Nouvelle Annonce</h1>
                <p className="text-slate-500 mt-1">
                    Créez un événement, un lieu ou un service.
                </p>
            </div>

            <ListingForm categories={categories} tags={tags} plans={plans} />
        </div>
    )
}
