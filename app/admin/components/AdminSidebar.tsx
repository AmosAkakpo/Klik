'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    MdDashboard,
    MdList,
    MdAddCircleOutline,
    MdRocketLaunch,
    MdPeople,
    MdPerson,
    MdSettings,
    MdCategory,
    MdLabel,
    MdPublic
} from 'react-icons/md'

interface AdminSidebarProps {
    role: 'super_admin' | 'manager'
}

export default function AdminSidebar({ role }: AdminSidebarProps) {
    const pathname = usePathname()

    const links = [
        {
            label: 'Tableau de bord',
            href: '/admin',
            icon: MdDashboard,
            roles: ['super_admin', 'manager']
        },
        {
            label: 'Annonces',
            href: '/admin/listings',
            icon: MdList,
            roles: ['super_admin', 'manager']
        },
        {
            label: 'Nouvelle Annonce',
            href: '/admin/listings/new',
            icon: MdAddCircleOutline,
            roles: ['super_admin', 'manager']
        },
        {
            label: 'Boosts',
            href: '/admin/boosts',
            icon: MdRocketLaunch,
            roles: ['super_admin', 'manager']
        },
        {
            label: 'Plans & Tarifs',
            href: '/admin/plans',
            icon: MdSettings,
            roles: ['super_admin']
        },
        {
            label: 'Lieux (Pays/Villes)',
            href: '/admin/locations',
            icon: MdPublic,
            roles: ['super_admin']
        },
        {
            label: 'Catégories & Tags',
            href: '/admin/categories',
            icon: MdCategory,
            roles: ['super_admin']
        },
        {
            label: 'Utilisateurs',
            href: '/admin/managers',
            icon: MdPeople,
            roles: ['super_admin']
        },
        {
            label: 'Mon Compte',
            href: '/admin/account',
            icon: MdPerson,
            roles: ['super_admin', 'manager']
        }
    ]

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                    KLik Admin
                </h1>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                    {role === 'super_admin' ? 'Super Administrateur' : 'Manager'}
                </p>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {links.map((link) => {
                        if (!link.roles.includes(role)) return null

                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin')

                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <link.icon className={`text-xl ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={async () => {
                            const { signOut } = await import('../actions')
                            await signOut()
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 w-full text-left"
                    >
                        <MdPerson className="text-xl" />
                        <span className="font-medium">Se déconnecter</span>
                    </button>
                    <div className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
                        <p className="text-xs text-slate-500 text-center">
                            &copy; {new Date().getFullYear()} KLik Platform
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
