import React from 'react'

export default function Header () {
  return (
    <div className='mb-8'>
      <span 
        className='bg-gradient-to-r from-orange-500 to-amber-500 text-sm text-white font-semibold px-4 py-1.5 rounded-lg inline-block mb-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:from-orange-400 hover:to-amber-400 hover:scale-105'
        style={{
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}
      >
        SPBGU
      </span>
      <h1 className='text-4xl font-bold text-white mb-1 transition-all duration-300 hover:text-gray-100'>
        Software Engineering
      </h1>
      <div className='w-16 h-0.5 bg-gradient-to-r from-orange-500 to-transparent mx-auto mt-2 opacity-60'></div>
    </div>
  )
} 