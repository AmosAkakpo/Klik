import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BoostForm from './BoostForm'

export default async function BoostsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch listings eligible for boost
    // (Only fetch listings created by this user that don't have an ACTIVE boost?)
    // For simplicity V1, fetch all their listings, and let UI handle filtering or showing visual status
    const { data: listings } = await supabase
        .from('listings')
        .select('id, title, plans(slug)')
        .eq('created_by', user.id)
        .eq('status', 'active') // Only active listings can be boosted
        .order('created_at', { ascending: false })

    // @ts-ignore
    return <BoostForm listings={listings || []} />
}
