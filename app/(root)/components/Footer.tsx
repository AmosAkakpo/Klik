import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-950 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-500 to-rose-500 bg-clip-text text-transparent">
              KLik.
            </Link>
            <p className="text-slate-500 text-sm">
              La plateforme de référence pour découvrir le Bénin.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="/explorez" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Espace Pro</Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-600">
          <p>© {currentYear} KLik. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-slate-400 transition-colors">Confidentialité</button>
            <button className="hover:text-slate-400 transition-colors">Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer