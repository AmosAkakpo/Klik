import React from 'react'
import OfferCard from './OfferCard'

const NosOffres = () => {
    const offers = [
        {
            title: "Basic",
            subtitle: "Simple et efficace",
            description: "Idéal pour petites annonces et services locaux",
            features: [
                "Publication standard",
                "Visible par catégorie et mots-clés",
                "Contact direct via WhatsApp"
            ]
        },
        {
            title: "Pro",
            subtitle: "Plus de visibilité",
            description: "Pour les professionnels qui veulent se démarquer",
            features: [
                "Publication prioritaire",
                "Badge Pro sur votre profil",
                "Statistiques détaillées",
                "Support client prioritaire"
            ]
        },
        {
            title: "Premium",
            subtitle: "Visibilité maximale",
            description: "La solution complète pour votre entreprise",
            features: [
                "Mise en avant en première page",
                "Badge Premium exclusif",
                "Analytics avancés",
                "Support dédié 24/7",
                "Publicité ciblée"
            ]
        }
    ]

    return (
        <div className='px-2 py-16 bg-neutral-900 border-y-2 border-neutral-800 '>
            <h2 className='text-3xl font-bold text-center'>Une Visibilité adaptee a tous</h2>
            <div className='p-8 flex justify-evenly flex-wrap gap-8'>
                {offers.map((offer, index) => (
                    <OfferCard
                        key={index}
                        title={offer.title}
                        subtitle={offer.subtitle}
                        description={offer.description}
                        features={offer.features}
                    />
                ))}
            </div>

        </div>
    )
}

export default NosOffres