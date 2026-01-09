'use client'

import { MdPhone, MdWhatsapp } from 'react-icons/md'
import { incrementClickCount } from '../actions'

interface ContactActionsProps {
    listingId: string
    contactPhone: string
    whatsappNumber: string
}

export default function ContactActions({ listingId, contactPhone, whatsappNumber }: ContactActionsProps) {

    const handlePhoneClick = async () => {
        await incrementClickCount(listingId, 'phone')
        window.location.href = `tel:${contactPhone}`
    }

    const handleWhatsAppClick = async () => {
        await incrementClickCount(listingId, 'whatsapp')
        window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank')
    }

    return (
        <div className="flex gap-3">
            {/* Primary: Call Button */}
            <button
                onClick={handlePhoneClick}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 border border-emerald-400/20"
            >
                <MdPhone className="text-xl" />
                Appeler
            </button>

            {/* Secondary: WhatsApp Button */}
            <button
                onClick={handleWhatsAppClick}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-900/30 transition-all hover:scale-105 active:scale-95 border border-green-400/20"
            >
                <MdWhatsapp className="text-xl" />
                WhatsApp
            </button>
        </div>
    )
}
