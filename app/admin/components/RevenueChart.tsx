'use client'

import { useMemo } from 'react'

interface DailyRevenue {
    date: string
    amount: number
}

export default function RevenueChart({ data }: { data: DailyRevenue[] }) {
    const maxAmount = useMemo(() => Math.max(...data.map(d => d.amount), 1000), [data])

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Revenus (7 derniers jours)</h3>

            <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
                {data.map((day) => {
                    const heightPercentage = (day.amount / maxAmount) * 100
                    return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                {day.amount.toLocaleString()} FCFA
                            </div>

                            {/* Bar */}
                            <div
                                className="w-full max-w-[40px] bg-blue-100 rounded-t-lg relative transition-all duration-500 group-hover:bg-blue-500"
                                style={{ height: `${heightPercentage}%` }}
                            >
                                {day.amount > 0 && (
                                    <div className="absolute top-0 w-full h-1 bg-blue-500 opacity-20 rounded-t-lg"></div>
                                )}
                            </div>

                            {/* Label */}
                            <div className="text-xs text-slate-400 font-medium">
                                {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
