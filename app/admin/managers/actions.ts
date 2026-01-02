'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleManagerStatus(managerId: string, currentStatus: boolean) {
    const supabase = await createClient()

    // 1. Auth & Role Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) return { error: 'Forbidden' }

    // 2. Prevent self-lockout
    if (managerId === user.id) {
        return { error: 'Vous ne pouvez pas désactiver votre propre compte.' }
    }

    // 3. Update
    const { error } = await supabase
        .from('managers')
        .update({ is_active: !currentStatus })
        .eq('id', managerId)

    if (error) {
        console.error('Toggle Status Error:', error)
        return { error: 'Erreur lors de la mise à jour' }
    }

    revalidatePath('/admin/managers')
}

export async function updateManagerRole(managerId: string, newRole: 'manager' | 'super_admin') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) return { error: 'Forbidden' }

    if (managerId === user.id) {
        return { error: 'Vous ne pouvez pas modifier votre propre rôle.' }
    }

    const { error } = await supabase
        .from('managers')
        .update({ role: newRole })
        .eq('id', managerId)

    if (error) return { error: 'Erreur lors de la mise à jour du rôle' }

    revalidatePath('/admin/managers')
}
