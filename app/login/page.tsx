'use client'

import { login } from './actions'
import { useActionState } from 'react' // or useFormState depending on Next.js version, assuming new version
// Note: if useActionState is not available, we fall back to a simpler wrapper. 
// For safety with older Next.js versions often used, I'll use a standard client component approach or check version?
// I'll stick to a simple form submission for robustness or standard React `useState`.

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // usage of redirect in server action handles success
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-gray-400">Please sign in to continue</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                            placeholder="admin@klik.bj"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
