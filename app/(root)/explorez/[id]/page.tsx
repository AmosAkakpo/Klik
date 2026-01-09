import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ListingHero from './components/ListingHero'
import ListingInfo from './components/ListingInfo'
import ContactActions from './components/ContactActions'
import ListingDetails from './components/ListingDetails'
import { incrementViewCount } from './actions'

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // Fetch listing data
    const { data: listing, error } = await supabase
        .from('listings')
        .select(`
      *,
      category:categories(name, slug),
      plan:plans(name, slug)
    `)
        .eq('id', id)
        .eq('status', 'active')
        .single()

    if (error || !listing) {
        notFound()
    }

    // Fetch related listings (same category, same city, exclude current)
    const { data: relatedListings } = await supabase
        .from('listings')
        .select('id, title, price, images, location_city')
        .eq('category_id', listing.category_id)
        .eq('location_city', listing.location_city)
        .eq('status', 'active')
        .neq('id', id)
        .limit(6)

    // Increment view count (server-side)
    await incrementViewCount(id)

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-200">
            {/* Hero Gallery */}
            <ListingHero images={listing.images} title={listing.title} />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 pb-32">

                {/* Info Section */}
                <ListingInfo
                    title={listing.title}
                    price={listing.price}
                    location_city={listing.location_city}
                    location_district={listing.location_district}
                    category={listing.category}
                    plan={listing.plan}
                    tier={listing.tier}
                />

                {/* Contact Actions (Desktop) */}
                <div className="hidden md:block">
                    <ContactActions
                        listingId={id}
                        contactPhone={listing.contact_phone}
                        whatsappNumber={listing.whatsapp_number}
                    />
                </div>

                {/* Details & Description */}
                <ListingDetails
                    description={listing.description}
                    contactName={listing.contact_name}
                    contactEmail={listing.contact_email}
                    locationAddress={listing.location_address}
                />

                {/* Related Listings */}
                {relatedListings && relatedListings.length > 0 && (
                    <section className="pt-8">
                        <h2 className="text-xl font-bold mb-4 text-white">Dans la même catégorie</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            {relatedListings.map((item) => (
                                <a
                                    key={item.id}
                                    href={`/explorez/${item.id}`}
                                    className="flex-shrink-0 w-48 bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all"
                                >
                                    <div className="aspect-square bg-neutral-800" />
                                    <div className="p-3">
                                        <p className="font-bold text-sm line-clamp-2 text-white">{item.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{item.price?.toLocaleString()} FCFA</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Sticky Contact Actions (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-xl border-t border-white/10 p-4">
                <ContactActions
                    listingId={id}
                    contactPhone={listing.contact_phone}
                    whatsappNumber={listing.whatsapp_number}
                />
            </div>
        </div>
    )
}
