import React from 'react'

interface StatCircleProps {
  value: number
  label: string
}

interface StatsOverviewProps {
  passingScore?: number
  admittedRank?: number
}

function StatCircle ({ value, label }: StatCircleProps) {
  return (
    <div className='flex flex-col items-center justify-center text-center bg-[#25252D] rounded-full w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 p-2 transition-all duration-300 hover:bg-[#2A2A34] hover:scale-105 cursor-pointer'
         style={{ 
           transition: 'all 0.3s ease, box-shadow 0.3s ease',
           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 37, 45, 0.6), 0 0 20px rgba(255, 255, 255, 0.1)'
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
         }}
    >
      <span className='text-xl md:text-2xl lg:text-3xl font-bold text-white transition-all duration-300'
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
        {value}
      </span>
      <span className='text-xs text-gray-400 mt-1 transition-colors duration-300'>{label}</span>
    </div>
  )
}

function AdmissionBlock ({ passingScore, admittedRank }: { passingScore?: number, admittedRank?: number }) {
  if (!passingScore || !admittedRank) return null
  
  return (
    <div className='flex flex-col justify-center space-y-4'>
      <div>
        <p className='text-sm text-gray-400'>Passing score</p>
        <p className='text-4xl font-bold text-white'>{passingScore}</p>
      </div>
      <div>
        <p className='text-sm text-gray-400'>Admitted rank</p>
        <p className='text-4xl font-bold text-white'>#{admittedRank}</p>
      </div>
    </div>
  )
}

export default function StatsOverview ({ passingScore, admittedRank }: StatsOverviewProps = {}) {
  return (
    <div className='w-full mb-8'>
      {/* Mobile Layout: Compact circles on left, admission info on right */}
      <div className='md:hidden px-2'>
        <div className='flex justify-center'>
          <div className='flex items-center justify-center w-full gap-4 max-w-md'>
            <div className='flex-[2] grid grid-cols-2 gap-3 place-items-center'>
              <StatCircle value={182} label='Total' />
              <StatCircle value={60} label='Special' />
              <StatCircle value={24} label='Targeted' />
              <StatCircle value={12} label='Separate' />
            </div>
            <div className='flex-1 flex items-center justify-center'>
              <AdmissionBlock passingScore={passingScore} admittedRank={admittedRank} />
            </div>
          </div>
        </div>
      </div>

      {/* Tablet/Desktop Layout: Responsive grid of circles only */}
      <div className='hidden md:block max-w-4xl mx-auto'>
        <div className='grid grid-cols-4 gap-6 lg:gap-8 place-items-center justify-center'>
          <StatCircle value={182} label='Total' />
          <StatCircle value={60} label='Special' />
          <StatCircle value={24} label='Targeted' />
          <StatCircle value={12} label='Separate' />
        </div>
      </div>
    </div>
  )
}