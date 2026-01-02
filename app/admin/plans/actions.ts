'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePlan(formData: FormData) {
    const supabase = await createClient()

    // 1. Check Super Admin (Security)
    // We can rely on RLS but explicit check is good UX to fail early
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Double check role
    const { data: manager } = await supabase
        .from('managers')
        .select('role')
        .eq('id', user.id)
        .single()

    if (manager?.role !== 'super_admin') {
        return { error: 'Access Denied: Super Admin only' }
    }

    // 2. Extract Data
    const id = formData.get('id') as string
    const price = parseFloat(formData.get('price') as string)
    const max_images = parseInt(formData.get('max_images') as string)
    const priority_level = parseInt(formData.get('priority_level') as string) // 0-100
    const video_allowed = formData.get('video_allowed') === 'on'
    const is_active = formData.get('is_active') === 'on'

    // 3. Update
    const { error } = await supabase
        .from('plans')
        .update({
            price,
            max_images,
            priority_level,
            video_allowed,
            is_active
        })
        .eq('id', id)

    if (error) {
        console.error('Plan Update Error:', error)
        return { error: 'Failed to update plan' }
    }

    revalidatePath('/admin/plans')
    return { success: true }
}
