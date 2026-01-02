'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// --- CATEGORIES ---

export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Super Admin Check (Double protection)
    // We can rely on RLS, but a quick check here is good UX
    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) return { error: 'Forbidden' }

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const icon = formData.get('icon') as string
    const display_order = parseInt(formData.get('display_order') as string || '0')

    const { error } = await supabase
        .from('categories')
        .insert({ name, slug, icon, display_order, is_active: true })

    if (error) {
        console.error('Create Category Error:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient()

    // Quick Super Admin check
    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) return { error: 'Forbidden' }

    const name = formData.get('name') as string
    const icon = formData.get('icon') as string
    const display_order = parseInt(formData.get('display_order') as string)
    const is_active = formData.get('is_active') === 'on'

    const { error } = await supabase
        .from('categories')
        .update({ name, icon, display_order, is_active })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/admin/categories')
}


// --- TAGS ---

export async function createTag(formData: FormData) {
    const supabase = await createClient()

    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) return { error: 'Forbidden' }

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string

    const { error } = await supabase
        .from('tags')
        .insert({ name, slug, is_active: true })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
}

export async function updateTag(id: string, formData: FormData) {
    const supabase = await createClient()

    const { data: isSuper } = await supabase.rpc('is_super_admin')
    if (!isSuper) return { error: 'Forbidden' }

    const name = formData.get('name') as string
    const is_active = formData.get('is_active') === 'on'

    const { error } = await supabase
        .from('tags')
        .update({ name, is_active })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/admin/categories')
}
