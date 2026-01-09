'use client'

import { useState, useEffect } from 'react'
import { MdCloudUpload, MdClose, MdCheck, MdAttachMoney, MdPayment } from 'react-icons/md'
import { createListing } from '../actions'

interface Category {
    id: string
    name: string
}

interface Tag {
    id: string
    name: string
}

interface Plan {
    id: string
    name: string
    price: number
    max_images: number
    video_allowed: boolean
}

interface Country {
    id: string
    name: string
    code: string
}

interface City {
    id: string
    name: string
    country_id: string
}

interface ListingFormProps {
    categories: Category[]
    tags: Tag[]
    plans: Plan[]
}

export default function ListingForm({ categories, tags, plans }: ListingFormProps) {
    const [loading, setLoading] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [selectedPlanId, setSelectedPlanId] = useState<string>('')
    const [paymentAmount, setPaymentAmount] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)

    // Location state
    const [countries, setCountries] = useState<Country[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [selectedCountryId, setSelectedCountryId] = useState<string>('')
    const [selectedCityId, setSelectedCityId] = useState<string>('')
    const [filteredCities, setFilteredCities] = useState<City[]>([])

    // Fetch countries and cities
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const { createClient } = await import('@/utils/supabase/client')
                const supabase = createClient()

                console.log('Fetching countries and cities...')

                const { data: countriesData, error: countriesError } = await supabase
                    .from('countries')
                    .select('*')
                    .eq('is_active', true)
                    .order('name')

                const { data: citiesData, error: citiesError } = await supabase
                    .from('cities')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order')

                if (countriesError) {
                    console.error('Error fetching countries:', countriesError)
                } else {
                    console.log('Countries fetched:', countriesData)
                    if (countriesData) setCountries(countriesData)
                }

                if (citiesError) {
                    console.error('Error fetching cities:', citiesError)
                } else {
                    console.log('Cities fetched:', citiesData)
                    if (citiesData) setCities(citiesData)
                }
            } catch (err) {
                console.error('Exception in fetchLocations:', err)
            }
        }
        fetchLocations()
    }, [])

    // Filter cities when country changes
    useEffect(() => {
        if (selectedCountryId) {
            const filtered = cities.filter(c => c.country_id === selectedCountryId)
            setFilteredCities(filtered)
            setSelectedCityId('') // Reset city selection
        } else {
            setFilteredCities([])
            setSelectedCityId('')
        }
    }, [selectedCountryId, cities])

    // Update payment amount when plan changes
    useEffect(() => {
        const plan = plans.find(p => p.id === selectedPlanId)
        if (plan) {
            setPaymentAmount(plan.price)
        }
    }, [selectedPlanId, plans])

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        )
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            // Check limits based on selected plan
            const plan = plans.find(p => p.id === selectedPlanId)
            const maxImages = plan?.max_images || 1
            const currentCount = previewImages.length
            const newCount = files.length

            if (currentCount + newCount > maxImages) {
                alert(`Le plan sélectionné autorise maximum ${maxImages} images.`)
                return
            }

            const newPreviews: string[] = []
            Array.from(files).forEach(file => {
                const objectUrl = URL.createObjectURL(file)
                newPreviews.push(objectUrl)
            })
            setPreviewImages(prev => [...prev, ...newPreviews])
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)

        // Validation: Transaction Info is required for paid plans
        if (paymentAmount > 0) {
            const method = formData.get('payment_method')
            const ref = formData.get('payment_reference')
            if (!method || !ref) {
                setError("Veuillez renseigner les informations de paiement.")
                setLoading(false)
                return
            }
        }

        // Append selected tags
        formData.set('tags', JSON.stringify(selectedTags))

        try {
            const result = await createListing(formData)

            // @ts-ignore
            if (result?.error) {
                // @ts-ignore
                setError(result.error)
                setLoading(false)
            }
        } catch (e) {
            console.error(e)
            setError('An unexpected error occurred.')
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 animate-fade-in-up">
            {/* 1. PLANS & PAYMENT (New Section) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MdAttachMoney className="text-blue-500" /> Offre & Paiement
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Choisir une Offre</label>
                        <div className="relative">
                            <select
                                name="plan_id"
                                required
                                value={selectedPlanId}
                                onChange={(e) => setSelectedPlanId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
                            >
                                <option value="">Choisir...</option>
                                {plans.map(plan => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name} - {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} FCFA`}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                        {selectedPlanId && (
                            <p className="text-xs text-slate-500 mt-2">
                                Limites: {plans.find(p => p.id === selectedPlanId)?.max_images} images max
                            </p>
                        )}
                    </div>

                    {/* Payment Details (Only if Paid Plan) */}
                    {paymentAmount > 0 && (
                        <div className="col-span-1 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in-up">
                            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <MdPayment /> Détails du Paiement
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Montant (FCFA)</label>
                                    <input
                                        name="payment_amount"
                                        type="number"
                                        value={paymentAmount}
                                        readOnly
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-bold cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Mode de Paiement</label>
                                    <select name="payment_method" className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
                                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                                        <option value="Moov Money">Moov Money</option>
                                        <option value="Espèces">Espèces</option>
                                        <option value="Virement Bancaire">Virement Bancaire</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Référence Transaction</label>
                                    <input
                                        name="payment_reference"
                                        type="text"
                                        placeholder="ID Transaction..."
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. General Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Informations de l'Annonce</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
                        <input name="title" required type="text" placeholder="Ex: Soirée Jazz au Code Bar"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea name="description" required rows={4} placeholder="Décrivez votre service ou événement..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                        <div className="relative">
                            <select name="category_id" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none">
                                <option value="">Choisir une catégorie...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tags / Mots-clés</label>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => {
                            const isSelected = selectedTags.includes(tag.id)
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${isSelected
                                        ? 'bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-500 ring-offset-1'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    {tag.name} {isSelected && <MdCheck className="inline ml-1" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* 3. Media */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Photos & Médias</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 transition-colors hover:bg-slate-100 relative group">
                    <input
                        type="file"
                        name="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={!selectedPlanId}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200 transition-colors">
                            <MdCloudUpload className="text-3xl" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-700">
                                {selectedPlanId ? 'Cliquez ou glissez vos photos ici' : 'Sélectionnez un plan d\'abord'}
                            </p>
                            <p className="text-sm text-slate-400">JPG, PNG jusqu'à 5MB</p>
                        </div>
                    </div>
                </div>

                {/* Previews */}
                {previewImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        {previewImages.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setPreviewImages(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <MdClose className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Details & Location */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Localisation & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Note: Price here is the LISTING price (e.g. Menu Item Price or Ticket Price), distinct from PLAN price */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Prix affiché (Optionnel)</label>
                        <div className="relative">
                            <input name="listing_price" type="number" placeholder="Ex: 5000"
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">FCFA</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Prix du service/produit pour le client final.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pays</label>
                        <div className="relative">
                            <select
                                name="country_id"
                                required
                                value={selectedCountryId}
                                onChange={(e) => setSelectedCountryId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
                            >
                                <option value="">Choisir un pays...</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
                        <div className="relative">
                            <select
                                name="city_id"
                                required
                                value={selectedCityId}
                                onChange={(e) => setSelectedCityId(e.target.value)}
                                disabled={!selectedCountryId}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Choisir une ville...</option>
                                {filteredCities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Quartier (Optionnel)</label>
                        <input name="location_district" type="text" placeholder="Ex: Cadjehoun, Akpakpa..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Adresse Complète (Optionnel)</label>
                        <input name="location_address" type="text" placeholder="Ex: Rue après la pharmacie, près du marché..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                </div>

                <div className="border-t border-slate-100 my-6 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom du Contact</label>
                        <input name="contact_name" required type="text" placeholder="Ex: Manager John"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                        <input name="contact_phone" required type="tel" placeholder="Ex: +229 97 00 00 00"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp</label>
                        <input name="whatsapp_number" type="tel" placeholder="Ex: +229 97 00 00 00"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-center font-medium">
                    {error}
                </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                    Annuler
                </button>
                <button
                    disabled={loading}
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Publication...' : 'Publier et Payer'}
                </button>
            </div>
        </form>
    )
}
