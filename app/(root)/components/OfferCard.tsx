import React from 'react'
import Link from 'next/link';
interface OfferCardProps {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    buttonText?: string;
    borderColor?: string;
}

const OfferCard: React.FC<OfferCardProps> = ({
    title,
    subtitle,
    description,
    features,
    buttonText = "Commencer",
    borderColor = "border-rose-500"
}) => {
    return (
        <div className={`flex flex-col items-center justify-center ${borderColor} border-2 rounded-lg`}>
            <div className='py-4 px-8 text-center bg-neutral-800 w-full rounded-t-lg'>
                <h3 className='text-2xl font-bold'>{title}</h3>
                <p className='text-gray-200'>{subtitle}</p>
                <p className='py-2 font-italic text-xs text-gray-500 text-center'>{description}</p>
            </div>

            <div className='py-8 px-8 bg-neutral-900 w-full h-full rounded-b-lg flex flex-col items-center'>
                <ul className='list-disc text-gray-300'>
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>

                <Link href='/contact'>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded-lg align-center my-6'>
                        {buttonText}
                    </button>
                </Link>

            </div>
        </div>
    )
}

export default OfferCard
