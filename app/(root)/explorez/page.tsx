import { createClient } from '@/utils/supabase/server'
import { MdSearch, MdFilterList } from 'react-icons/md'

export default async function ExplorePage() {
  const supabase = await createClient()

  // 1. Fetch Hero Carousel Items (RPC)
  const { data: heroListings } = await supabase.rpc('get_explore_hero')

  // 2. Fetch Featured Items (Logic: e.g. Random Premium/Pro)
  // We can use a simplified query for now or RPC
  const { data: featuredListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .gt('current_priority', 0) // Pro or Premium
    .limit(6)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* SEARCH HEADER (Mobile Sticky) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4">
        <div className="flex gap-2 max-w-5xl mx-auto">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              disabled
              placeholder="Rechercher (Ex: Concert, Restaurant...)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-sm hover:bg-slate-50">
            <MdFilterList className="text-xl" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        {/* 1. HERO CAROUSEL */}
        {heroListings && heroListings.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">À la une ⚡</h2>
            {/* Placeholder for Carousel Component */}
            <div className="aspect-[16/9] md:aspect-[21/9] bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
              Carousel Component ({heroListings.length} items)
            </div>
          </section>
        )}

        {/* 2. FEATURED GRID */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800">Recommandés</h2>
            <span className="text-blue-600 text-sm font-bold">Voir tout</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredListings?.map(l => (
              <div key={l.id} className="bg-white p-4 rounded-xl shadow-sm h-40 flex items-center justify-center border border-slate-100">
                {l.title}
              </div>
            ))}
          </div>
        </section>

        {/* 3. EXPLORE FEED (Client Component will go here) */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Explorez tout</h2>
          <div className="bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-100">
            Infinite Scroll Feed Loading...
          </div>
        </section>
      </div>
    </div>
  )
}