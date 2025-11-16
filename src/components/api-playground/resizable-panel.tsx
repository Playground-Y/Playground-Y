'use client'

import { useState, useRef, useEffect } from 'react'

interface ResizablePanelProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export function ResizablePanel({ left, right, defaultWidth = 700, minWidth = 400, maxWidth = 1200 }: ResizablePanelProps) {
  const [rightPanelWidth, setRightPanelWidth] = useState(defaultWidth)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragStartWidth = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - dragStartX.current
      const newWidth = Math.max(minWidth, Math.min(maxWidth, dragStartWidth.current - deltaX))
      setRightPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, minWidth, maxWidth])

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragStartWidth.current = rightPanelWidth
  }

  return (
    <div className="flex flex-1 min-w-0">
      <div className="flex-1 bg-background overflow-auto min-w-0 flex-shrink">
        {left}
      </div>

      <div 
        className="w-1 bg-default hover:bg-primary cursor-col-resize transition-colors relative group"
        onMouseDown={handleDragStart}
      >
        <div className="absolute inset-0 w-3 -left-1 cursor-col-resize" />
      </div>

      <div 
        className="bg-code-editor text-white relative flex flex-col"
        style={{ width: `${rightPanelWidth}px` }}
      >
        {right}
      </div>
    </div>
  )
}

