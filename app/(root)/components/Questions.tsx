import React from 'react'
import FAQItem from './FAQItem'

const Questions = () => {
    const faqs = [
        {
            question: "Comment publier une annonce sur KLik ?",
            answer: "C'est simple ! Contactez nous, choisissez l'offre qui vous convient (Basique, Pro ou Premium), et remplissez les détails de votre service ou événement. Votre annonce sera visible immédiatement après validation par notre équipe."
        },
        {
            question: "Quelles sont les différentes offres disponibles ?",
            answer: "Nous proposons trois niveaux : Basique, Pro et Premium pour une visibility maximale. Chaque offre est conçue pour s'adapter à vos besoins et à votre budget."
        },
        {
            question: "Comment fonctionne l'offre Boost ?",
            answer: "L'offre Boost est une option supplémentaire qui propulse votre annonce tout en haut de la page 'Explorer' pendant 24h ou 48h. C'est l'outil idéal pour un événement ponctuel ou une promotion urgente et valable seulement pour la souscription premium."
        },
        {
            question: "Comment les utilisateurs peuvent-ils me contacter ?",
            answer: "Klik privilégie le contact direct. Chaque annonce affiche un bouton WhatsApp et un numéro de téléphone permettant aux clients de vous joindre instantanément en un clic, sans intermédiaire."
        },
        {
            question: "Klik consomme-t-il beaucoup de données mobiles ?",
            answer: "Non, nous avons optimisé KLik pour le contexte béninois. La page d'exploration utilise un chargement intelligent et des images compressées pour minimiser la consommation de votre forfait internet tout en restant fluide."
        }
    ]

    return (
        <div className='px-4 py-12 bg-neutral-900'>
            <div className='max-w-4xl mx-auto'>
                <div className='text-center mb-12'>
                    <h2 className='text-4xl font-bold text-white mb-3'>
                        Questions Fréquentes
                    </h2>
                    <p className='text-gray-400 text-lg'>
                        Tout ce que vous devez savoir sur KLik
                    </p>
                </div>

                <div className='space-y-4'>
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </div>

                <div className='mt-12 text-center p-6 bg-neutral-900 rounded-lg border border-neutral-800'>
                    <p className='text-gray-300 mb-4'>
                        Vous avez d'autres questions ?
                    </p>
                    <a
                        href='/contact'
                        className='inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium'
                    >
                        Contactez-nous
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Questions