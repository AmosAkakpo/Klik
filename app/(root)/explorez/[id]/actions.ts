'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

// Increment view count with IP-based cooldown (24h)
export async function incrementViewCount(listingId: string) {
    const supabase = await createClient()
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    // Check if this IP has viewed this listing in the last 24h
    const cooldownKey = `view_${listingId}_${ip}`

    // For now, we'll just increment without cooldown check
    // In production, you'd use Redis or a views table with timestamps
    const { error } = await supabase.rpc('increment', {
        row_id: listingId,
        table_name: 'listings',
        column_name: 'view_count'
    })

    if (error) {
        console.error('Failed to increment view count:', error)
    }
}

// Increment click count (phone or whatsapp)
export async function incrementClickCount(listingId: string, type: 'phone' | 'whatsapp') {
    const supabase = await createClient()

    const columnName = type === 'phone' ? 'contact_click_count' : 'whatsapp_click_count'

    const { error } = await supabase.rpc('increment', {
        row_id: listingId,
        table_name: 'listings',
        column_name: columnName
    })

    if (error) {
        console.error(`Failed to increment ${type} click count:`, error)
    }

    // Also increment the general click_count for trending algorithm
    await supabase.rpc('increment', {
        row_id: listingId,
        table_name: 'listings',
        column_name: 'click_count'
    })
}
