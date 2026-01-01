'use client'
import React from 'react'
import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";

const ContactPage = () => {
  return (
    <div className='min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-white mb-4'>Contactez-nous</h1>
          <p className='text-gray-400 text-lg'>Une question ? Un projet ? N'hésitez pas à nous écrire.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24'>
          {/* Contact Info */}
          <div className='flex flex-col justify-center space-y-8'>
            <div className='bg-neutral-900 p-8 rounded-2xl border border-neutral-800 transition-transform duration-300 hover:scale-[1.02]'>
              <h2 className='text-2xl font-bold text-white mb-8'>Nos Coordonnées</h2>

              <div className='space-y-8'>
                <div className='flex items-center space-x-6 group'>
                  <div className='bg-blue-500/10 p-4 rounded-full group-hover:bg-blue-500/20 transition-colors'>
                    <FaPhone className='text-blue-500 text-2xl' />
                  </div>
                  <div>
                    <h3 className='text-gray-400 text-sm font-medium uppercase tracking-wider'>Téléphone</h3>
                    <p className='text-white text-lg font-semibold mt-1'>+229 01 02 03 04</p>
                  </div>
                </div>

                <div className='flex items-center space-x-6 group'>
                  <div className='bg-rose-500/10 p-4 rounded-full group-hover:bg-rose-500/20 transition-colors'>
                    <FaEnvelope className='text-rose-500 text-2xl' />
                  </div>
                  <div>
                    <h3 className='text-gray-400 text-sm font-medium uppercase tracking-wider'>Email</h3>
                    <p className='text-white text-lg font-semibold mt-1'>contact@klik.bj</p>
                  </div>
                </div>

                <div className='flex items-center space-x-6 group'>
                  <div className='bg-violet-500/10 p-4 rounded-full group-hover:bg-violet-500/20 transition-colors'>
                    <FaLocationDot className='text-violet-500 text-2xl' />
                  </div>
                  <div>
                    <h3 className='text-gray-400 text-sm font-medium uppercase tracking-wider'>Adresse</h3>
                    <p className='text-white text-lg font-semibold mt-1'>Cotonou, Bénin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-neutral-900 p-8 sm:p-10 rounded-2xl border border-neutral-800 shadow-xl'>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-2'>Nom complet</label>
                  <input
                    type="text"
                    className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600'
                    placeholder='Votre nom'
                  />
                </div>
                <div>
                  <label className='block text-gray-400 text-sm font-medium mb-2'>Email</label>
                  <input
                    type="email"
                    className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600'
                    placeholder='votre@email.com'
                  />
                </div>
              </div>

              <div>
                <label className='block text-gray-400 text-sm font-medium mb-2'>Sujet</label>
                <input
                  type="text"
                  className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600'
                  placeholder='Le sujet de votre message'
                />
              </div>

              <div>
                <label className='block text-gray-400 text-sm font-medium mb-2'>Message</label>
                <textarea
                  className='w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-40 resize-none placeholder-gray-600'
                  placeholder='Votre message...'
                ></textarea>
              </div>

              <button className='w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1'>
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage