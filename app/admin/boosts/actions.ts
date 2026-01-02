'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBoost(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const listing_id = formData.get('listing_id') as string
    const duration = parseInt(formData.get('duration') as string)
    // IMPORTANT: Security Check - In a real app we would recalculate amount here based on DB, ignoring formData amount
    // But for this quick implementation we trust the logic, or we could fetch plan + daily rate.

    const payment_method = formData.get('payment_method') as string
    const payment_reference = formData.get('payment_reference') as string

    // 0. Verify Plan is Premium
    const { data: listing } = await supabase
        .from('listings')
        .select('plans(slug)')
        .eq('id', listing_id)
        .single()

    // @ts-ignore
    if (listing?.plans?.slug !== 'premium') {
        console.error('Boost Attempt on non-premium listing')
        // We could return error, but redirecting for now or just continuing (policy might block? no)
        return { error: 'Seules les annonces Premium peuvent être boostées.' }
    }

    // Recalculate Amount (Security)
    const fixedRate = 500
    const calculatedAmount = duration * fixedRate

    // 1. Create Transaction
    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
            amount: calculatedAmount,
            type: 'boost_fee',
            payment_method,
            payment_reference,
            manager_id: user.id,
            status: 'completed',
            description: `Boost de ${duration} jours pour l'annonce ID: ${listing_id}`
        })
        .select()
        .single()

    if (txError) {
        console.error('Boost Tx Error:', txError)
        return { error: 'Erreur de paiement' }
    }

    // 2. Create Boost Record
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration)

    const { error: boostError } = await supabase
        .from('listing_boosts')
        .insert({
            listing_id,
            transaction_id: transaction.id,
            end_date: endDate.toISOString(),
            is_active: true,
            created_by: user.id
        })

    if (boostError) {
        console.error('Boost Create Error:', boostError)
        return { error: 'Erreur lors de l\'activation du boost' }
    }

    // 3. Update Listing priority
    // Boosted Premium get higher priority (e.g., 100)
    await supabase.from('listings').update({ current_priority: 100 }).eq('id', listing_id)

    revalidatePath('/admin/boosts')
    revalidatePath('/admin/listings')
    redirect('/admin/boosts')
}
