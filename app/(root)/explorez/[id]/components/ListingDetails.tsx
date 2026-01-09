'use client'

import { useState } from 'react'
import { MdPerson, MdEmail, MdLocationOn } from 'react-icons/md'

interface ListingDetailsProps {
    description: string
    contactName: string
    contactEmail: string | null
    locationAddress: string | null
}

export default function ListingDetails({
    description,
    contactName,
    contactEmail,
    locationAddress
}: ListingDetailsProps) {
    const [expanded, setExpanded] = useState(false)
    const shouldTruncate = description.length > 300

    return (
        <div className="space-y-6">
            {/* Description */}
            <div className="bg-neutral-900/50 rounded-3xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                <p className={`text-slate-300 leading-relaxed whitespace-pre-wrap ${!expanded && shouldTruncate ? 'line-clamp-6' : ''}`}>
                    {description}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-3 text-blue-400 font-bold hover:text-blue-300 transition-colors"
                    >
                        {expanded ? 'Voir moins' : 'Lire plus'}
                    </button>
                )}
            </div>

            {/* Contact Information */}
            <div className="bg-neutral-900/50 rounded-3xl p-6 border border-white/5 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Informations de contact</h2>

                <div className="flex items-center gap-3 text-slate-300">
                    <MdPerson className="text-blue-500 text-xl" />
                    <span className="font-medium">{contactName}</span>
                </div>

                {contactEmail && (
                    <div className="flex items-center gap-3 text-slate-300">
                        <MdEmail className="text-blue-500 text-xl" />
                        <a href={`mailto:${contactEmail}`} className="font-medium hover:text-blue-400 transition-colors">
                            {contactEmail}
                        </a>
                    </div>
                )}

                {locationAddress && (
                    <div className="flex items-start gap-3 text-slate-300">
                        <MdLocationOn className="text-blue-500 text-xl mt-0.5" />
                        <span className="font-medium">{locationAddress}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
