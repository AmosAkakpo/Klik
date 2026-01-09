'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import ExploreHero from './components/ExploreHero'
import FeaturedGrid from './components/FeaturedGrid'
import ExploreFeed from './components/ExploreFeed'
import SearchHeader from './components/SearchHeader'
import FilterDrawer, { FilterState } from './components/FilterDrawer'

export default function ExplorePage() {
  const supabase = createClient()
  const [heroListings, setHeroListings] = useState<any[]>([])
  const [featuredListings, setFeaturedListings] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  })

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      // Hero listings
      const { data: hero } = await supabase.rpc('get_explore_hero')
      if (hero) setHeroListings(hero)

      // Featured listings
      const { data: featured } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .gte('current_priority', 10)
        .order('current_priority', { ascending: false })
        .limit(6)
      if (featured) setFeaturedListings(featured)

      // Categories for filter
      const { data: cats } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('display_order')
      if (cats) setCategories(cats)

      // Cities for filter
      const { data: citiesData } = await supabase
        .from('cities')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order')
      if (citiesData) setCities(citiesData)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 pb-24 text-slate-200 selection:bg-rose-500/30">

      {/* SEARCH HEADER */}
      <SearchHeader
        onSearch={setSearchQuery}
        onFilterOpen={() => setFilterDrawerOpen(true)}
      />

      {/* FILTER DRAWER */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApplyFilters={setFilters}
        categories={categories}
        cities={cities}
      />

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

          <ExploreFeed searchQuery={searchQuery} filters={filters} />
        </section>
      </div>
    </div>
  )
}
