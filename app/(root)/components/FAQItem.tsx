'use client'
import React, { useState } from 'react'
import { IoChevronDown } from "react-icons/io5";

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='border border-neutral-700 rounded-lg bg-neutral-800/50 backdrop-blur-sm hover:border-neutral-600 transition-all duration-300'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-full px-6 py-4 flex justify-between items-center text-left group'
            >
                <h3 className='text-lg font-semibold text-gray-100 group-hover:text-white transition-colors'>
                    {question}
                </h3>
                <IoChevronDown
                    className={`text-neutral-400 group-hover:text-white transition-all duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    size={20}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className='px-6 pb-4 text-gray-300 leading-relaxed'>
                    {answer}
                </div>
            </div>
        </div>
    )
}

export default FAQItem
