import React from 'react'
import FAQItem from './FAQItem'

const Questions = () => {
    const faqs = [
        {
            question: "Comment publier une annonce sur KLik ?",
            answer: "Il vous suffit de cliquer sur 'Publier une annonce', de remplir les informations demandées (titre, description, catégorie, localisation), d'ajouter des photos si nécessaire, et de soumettre votre annonce. Elle sera visible immédiatement après validation."
        },
        {
            question: "Les annonces sont-elles gratuites ?",
            answer: "Oui, la publication d'annonces basiques est entièrement gratuite. Nous proposons également des options Premium pour augmenter la visibilité de vos annonces avec des fonctionnalités supplémentaires comme la mise en avant et les statistiques détaillées."
        },
        {
            question: "Comment contacter un vendeur ou prestataire ?",
            answer: "Chaque annonce dispose d'un bouton de contact direct qui vous permet de joindre le vendeur via WhatsApp. Vous pouvez ainsi échanger rapidement et en toute sécurité."
        },
        {
            question: "Puis-je modifier ou supprimer mon annonce après publication ?",
            answer: "Absolument ! Une fois connecté à votre compte, accédez à 'Mes annonces' où vous pourrez modifier, mettre en pause ou supprimer vos annonces à tout moment."
        },
        {
            question: "Quelles sont les catégories disponibles ?",
            answer: "KLik couvre plusieurs catégories : Événements, Services, Restaurants & Cafés, Immobilier, Emploi, Véhicules, et bien plus. Vous pouvez facilement naviguer par catégorie pour trouver ce que vous cherchez."
        },
        {
            question: "Comment fonctionne l'offre Boost ?",
            answer: "L'offre Boost permet de mettre votre annonce en avant pendant 24h ou 48h. Votre annonce apparaîtra en haut des résultats de recherche et aura une visibilité maximale, augmentant ainsi vos chances de contact."
        }
    ]

    return (
        <div className='px-4 py-12 bg-neutral-950'>
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