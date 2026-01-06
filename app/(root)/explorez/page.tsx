import { createClient } from '@/utils/supabase/server'
import { MdSearch, MdFilterList } from 'react-icons/md'
import ExploreHero from './components/ExploreHero'
import FeaturedGrid from './components/FeaturedGrid'
import ExploreFeed from './components/ExploreFeed'

export default async function ExplorePage() {
  const supabase = await createClient()

  // 1. Fetch Hero Carousel Items (RPC)
  // We use the RPC 'get_explore_hero' which returns 5 random premium/boosted items
  const { data: heroListings } = await supabase.rpc('get_explore_hero')

  // 2. Fetch Featured Items (Logic: e.g. Random Premium/Pro)
  // We fetch a mix of items with priority > 0 (Basic is 1, so >1 means Pro/Premium ideally, but let's say > 0 covers paying users)
  // Wait, recent plan change: Basic = 1. So we want Pro(10)/Premium(20). 
  // Let's filter priority >= 10 for "Recommandés" to give value to Pro/Premium.
  const { data: featuredListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .gte('current_priority', 10) // Pro (10) or Premium (20)
    .order('current_priority', { ascending: false }) // Prioritize Premium
    .limit(6)

  return (
    <div className="min-h-screen bg-neutral-950 pb-24 text-slate-200 selection:bg-rose-500/30">

      {/* SEARCH HEADER (Sticky, Glassmorphism Dark) */}
      <div className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="flex gap-3 max-w-5xl mx-auto">
          <div className="relative flex-1 group">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors text-xl" />
            <input
              disabled
              placeholder="Rechercher (Ex: Concert, Restaurant...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-neutral-900 border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-medium placeholder:text-slate-600 transition-all text-white shadow-inner"
            />
          </div>
          <button className="p-3.5 bg-neutral-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-neutral-800 hover:border-white/10 transition-all shadow-lg shadow-black/20 active:scale-95">
            <MdFilterList className="text-xl" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-12">

        {/* 1. HERO CAROUSEL */}
        {heroListings && heroListings.length > 0 && (
          <div className="animate-fade-in-up">
            {/* @ts-ignore */}
            <ExploreHero listings={heroListings} />
          </div>
        )}

        {/* 2. FEATURED GRID (Bento Style) */}
        {featuredListings && featuredListings.length > 0 && (
          // @ts-ignore
          <FeaturedGrid listings={featuredListings} />
        )}

        {/* 3. EXPLORE FEED */}
        <section className="animate-fade-in-up delay-200">
          <div className="flex items-center gap-2 mb-6 px-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Explorer</h2>
          </div>

          <ExploreFeed />
        </section>
      </div>
    </div>
  )
}