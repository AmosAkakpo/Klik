'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export async function createListing(formData: FormData) {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 2. Extract Data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category_id = formData.get('category_id') as string
    const listing_price = formData.get('listing_price') as string // Price of the item/service
    const plan_id = formData.get('plan_id') as string // ID of the plan selected

    // Contact
    const contact_name = formData.get('contact_name') as string
    const contact_phone = formData.get('contact_phone') as string
    const whatsapp_number = formData.get('whatsapp_number') as string
    const contact_email = formData.get('contact_email') as string

    // Location
    const location_city = formData.get('location_city') as string
    const location_address = formData.get('location_address') as string

    const tagsJson = formData.get('tags') as string
    const tagIds = tagsJson ? JSON.parse(tagsJson) : []

    // Payment Info
    const paymentMethod = formData.get('payment_method') as string
    const paymentRef = formData.get('payment_reference') as string

    // Securely get price from Plan
    let paymentAmount = 0
    if (plan_id) {
        const { data: plan } = await supabase.from('plans').select('price').eq('id', plan_id).single()
        if (plan) paymentAmount = plan.price
    }

    // 3. Handle Image Uploads
    const images: string[] = []
    const imageFiles = formData.getAll('images') as File[]

    for (const file of imageFiles) {
        if (file.size > 0 && file.name !== 'undefined') {
            const fileExt = file.name.split('.').pop()
            const fileName = `${uuidv4()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('listings')
                .upload(filePath, file)

            if (uploadError) {
                console.error('Upload error:', uploadError)
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from('listings')
                .getPublicUrl(filePath)

            images.push(publicUrl)
        }
    }

    // 4. Create Transaction (if paid)
    let transaction_id = null

    if (paymentAmount > 0 && paymentRef) {
        const { data: transaction, error: txError } = await supabase
            .from('transactions')
            .insert({
                amount: paymentAmount,
                type: 'listing_fee',
                payment_method: paymentMethod,
                payment_reference: paymentRef,
                manager_id: user.id,
                status: 'completed',
                description: `Paiement pour annonce: ${title}`
            })
            .select()
            .single()

        if (txError) {
            console.error('Transaction Error:', txError)
            return { error: 'Erreur lors de l\'enregistrement du paiement.' }
        }
        transaction_id = transaction.id
    }

    // 5. Insert Listing
    const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert({
            title,
            description,
            category_id,
            price: listing_price ? parseFloat(listing_price) : null,
            plan_id: plan_id || null, // Link to the plan
            transaction_id: transaction_id, // Link to the payment
            contact_name,
            contact_phone,
            whatsapp_number,
            contact_email,
            location_city,
            location_district: '',
            location_address,
            images: images,
            status: 'active',
            published_at: new Date().toISOString(),
            created_by: user.id,
            updated_by: user.id
        })
        .select()
        .single()

    if (insertError) {
        console.error('Insert error:', insertError)
        return { error: 'Failed to create listing: ' + insertError.message }
    }

    // 6. Insert Tags
    if (tagIds.length > 0 && listing) {
        const tagInserts = tagIds.map((tagId: string) => ({
            listing_id: listing.id,
            tag_id: tagId
        }))

        const { error: tagError } = await supabase
            .from('listing_tags')
            .insert(tagInserts)

        if (tagError) console.error('Tag insert error:', tagError)
    }

    revalidatePath('/admin')
    revalidatePath('/admin/listings')
    redirect('/admin')
}
