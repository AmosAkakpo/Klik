import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-neutral-900 h-full '>
      <Navbar />
      <main className=' text-gray-200'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default layout