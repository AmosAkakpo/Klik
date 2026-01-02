'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const full_name = formData.get('full_name') as string

    const { error } = await supabase
        .from('managers')
        .update({ full_name })
        .eq('id', user.id)

    if (error) {
        console.error('Update Profile Error:', error)
        return { error: 'Erreur lors de la mise à jour' }
    }

    revalidatePath('/admin/account')
    return { success: 'Profil mis à jour avec succès' }
}
