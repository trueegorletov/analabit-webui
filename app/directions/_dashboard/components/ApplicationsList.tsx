import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Application, OrigCeltStatus, AdmissionDecision } from '../types'
import { CheckCircleIcon } from './icons/CheckCircleIcon'
import { YellowDotIcon } from './icons/YellowDotIcon'
import { SimpleCheckIcon } from './icons/SimpleCheckIcon'
import { SimpleBlackCheckIcon } from './icons/SimpleBlackCheckIcon'

interface ApplicationsListProps {
  applications: Application[]
}

const MIN_TABLE_HEIGHT = 150 // pixels
const MAX_TABLE_HEIGHT = 700 // pixels
const INITIAL_TABLE_HEIGHT = 320 // pixels
const CLICK_DRAG_THRESHOLD = 5 // pixels to differentiate click from drag

export default function ApplicationsList ({ applications }: ApplicationsListProps) {
  const [currentHeight, setCurrentHeight] = useState(INITIAL_TABLE_HEIGHT)
  const resizableDivRef = useRef<HTMLDivElement>(null)
  
  const dragStateRef = useRef({
    isResizing: false, // True if a drag operation is actively changing size
    isPotentialDrag: false, // True on mousedown, to check if it becomes a drag or a click
    initialMouseY: 0,
    initialHeight: 0
  })

  const toggleTableHeight = useCallback(() => {
    // Using a small tolerance for comparison with MAX_TABLE_HEIGHT
    if (currentHeight < MAX_TABLE_HEIGHT - 1) {
      setCurrentHeight(MAX_TABLE_HEIGHT)
    } else {
      setCurrentHeight(INITIAL_TABLE_HEIGHT)
    }
  }, [currentHeight])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragStateRef.current.isPotentialDrag || !resizableDivRef.current) return

    const deltaY = event.clientY - dragStateRef.current.initialMouseY

    if (!dragStateRef.current.isResizing && Math.abs(deltaY) > CLICK_DRAG_THRESHOLD) {
      dragStateRef.current.isResizing = true
      document.body.style.userSelect = 'none'
    }

    if (dragStateRef.current.isResizing) {
      let newHeight = dragStateRef.current.initialHeight + deltaY
      newHeight = Math.max(MIN_TABLE_HEIGHT, Math.min(newHeight, MAX_TABLE_HEIGHT))
      setCurrentHeight(newHeight)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!dragStateRef.current.isPotentialDrag) return

    if (!dragStateRef.current.isResizing) {
      // If not resizing, it was a click
      toggleTableHeight()
    }
    
    if (dragStateRef.current.isResizing) {
      document.body.style.userSelect = ''
    }

    dragStateRef.current.isResizing = false
    dragStateRef.current.isPotentialDrag = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, toggleTableHeight])

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault() // Prevent text selection on drag
    if (!resizableDivRef.current) return

    dragStateRef.current = {
      isResizing: false,
      isPotentialDrag: true,
      initialMouseY: event.clientY,
      initialHeight: resizableDivRef.current.offsetHeight
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, handleMouseUp])

  useEffect(() => {
    // Cleanup function
    return () => {
      if (dragStateRef.current.isPotentialDrag || dragStateRef.current.isResizing) {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = '' // Ensure userSelect is reset
      }
    }
  }, [handleMouseMove, handleMouseUp])

  const renderOrigCelt = (status: OrigCeltStatus) => {
    if (status === OrigCeltStatus.YES) {
      return <CheckCircleIcon className='w-5 h-5 text-green-500 mx-auto' />
    }
    return <YellowDotIcon className='w-5 h-5 text-yellow-500 mx-auto' />
  }

  const renderOtherUnlv = (value?: number | 'check') => {
    if (value === 'check') {
      return <SimpleBlackCheckIcon className='w-5 h-5 text-gray-300 mx-auto' />
    }
    if (typeof value === 'number') {
      return <span className='text-gray-200'>{value}</span>
    }
    return <span className='text-gray-500'>-</span>
  }

  const renderAdmission = (app: Application) => {
    switch (app.admission) {
      case AdmissionDecision.ADMITTED_TEXT:
        return <span className='text-green-400 font-medium'>Зачислен</span>
      case AdmissionDecision.NOT_COMPETING_TEXT:
        return <span className='text-yellow-500 font-medium'>Не конкурсует</span>
      case AdmissionDecision.ADMITTED_GREEN_CHECK:
        return <SimpleCheckIcon className='w-5 h-5 text-green-500 mx-auto' />
      default:
        return <span className='text-gray-500'>-</span>
    }
  }

  return (
    <div>
      <h2 className='text-xl font-semibold text-white mb-4'>Список заявлений</h2>
      <div
        ref={resizableDivRef}
        className='overflow-x-auto overflow-y-auto border border-gray-600 rounded-t-md relative bg-[#1C1C22] applications-scrollbar'
        style={{ height: `${currentHeight}px` }}
      >
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-700'>
              <th className='py-2 px-1 text-left font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm'>Ранг</th>
              <th className='py-2 px-1 text-left font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm'>ID</th>
              <th className='py-2 px-1 text-right font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm'>Прио</th>
              <th className='py-2 px-1 text-right font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm'>Балл</th>
              <th className='py-2 px-1 text-center font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm'>О,Ц</th>
              <th className='py-2 px-1 text-center font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm'>Др</th>
              <th className='py-2 px-1 text-left font-medium text-gray-400 sticky top-0 bg-[#1C1C22] z-10 text-xs sm:text-sm'>Зач</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr
                key={app.studentId}
                className={`border-b border-gray-700 hover:bg-gray-700/30 ${index % 2 === 0 ? '' : 'bg-black/10'}`}
              >
                <td className={`py-2 px-1 text-xs sm:text-sm ${app.isCurrentUser ? 'text-green-400 font-bold' : 'text-gray-200'}`}>{app.rank}</td>
                <td className='py-2 px-1 text-xs sm:text-sm text-gray-200 truncate max-w-0'>{app.studentId}</td>
                <td className='py-2 px-1 text-right text-xs sm:text-sm text-gray-200'>{app.priority}</td>
                <td className='py-2 px-1 text-right text-xs sm:text-sm text-gray-200'>{app.score}</td>
                <td className='py-2 px-1 text-center text-xs sm:text-sm'>{renderOrigCelt(app.origCelt)}</td>
                <td className='py-2 px-1 text-center text-xs sm:text-sm'>{renderOtherUnlv(app.otherUnlv)}</td>
                <td className='py-2 px-1 text-left text-xs sm:text-sm'>{renderAdmission(app)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className='w-full h-4 bg-gray-700 hover:bg-gray-600 cursor-ns-resize flex items-center justify-center select-none rounded-b-md border-x border-b border-gray-600'
        onMouseDown={handleMouseDown}
        role='separator'
        aria-orientation='horizontal'
        aria-label='Resize table height. Click to toggle between max and default height. Drag to resize.'
        tabIndex={0}
      >
        <svg width='24' height='4' viewBox='0 0 24 4' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-6 h-1 text-gray-400'>
          <circle cx='2' cy='2' r='2' fill='currentColor' />
          <circle cx='12' cy='2' r='2' fill='currentColor' />
          <circle cx='22' cy='2' r='2' fill='currentColor' />
        </svg>
      </div>
    </div>
  )
} 