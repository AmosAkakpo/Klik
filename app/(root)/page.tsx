import React from 'react'
import HomeHero from '@/app/(root)/components/HomeHero'
import Lepsum from '@/app/(root)/components/Lepsum'
import NosOffres from './components/NosOffres'
import Questions from './components/Questions'
import WhatWeDo from './components/WhatWeDo'

const page = () => {
  return (
    <div>
      <HomeHero />
      <WhatWeDo />
      <NosOffres />

      <Questions />



    </div>
  )
}

export default page