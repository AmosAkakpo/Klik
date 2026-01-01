import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './components/AdminSidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch the manager profile to get the role
    const { data: manager } = await supabase
        .from('managers')
        .select('role')
        .eq('id', user.id)
        .single()

    // If manager record doesn't exist yet (race condition on signup?), use safe default or error
    // For now, if no manager record, we treat as manager or block. 
    // Given we have an auto-trigger, it should exist. 
    // If connection fails, manager might be null.

    const role = manager?.role || 'manager'

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar role={role as 'super_admin' | 'manager'} />
            <main className="flex-1 overflow-x-hidden">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
