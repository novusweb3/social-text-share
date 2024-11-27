import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShare2, FiCopy } from 'react-icons/fi'
import { RiTwitterXFill } from 'react-icons/ri' // New X icon

export interface SocialTextShareProps {
  className?: string
  customIcons?: {
    copy?: React.ReactNode
    x?: React.ReactNode // Changed from twitter to x
    share?: React.ReactNode
  }
  theme?: {
    background?: string
    text?: string
    border?: string
    hoverBg?: string
  }
  onCopy?: (text: string) => void
  onShare?: (text: string, platform: 'x' | 'copy') => void // Changed from twitter to x
}

export function SocialTextShare({
  className = '',
  customIcons,
  theme = {
    background: '#252525',
    text: '#ffffff',
    border: '#374151',
    hoverBg: 'rgba(255, 255, 255, 0.1)'
  },
  onCopy,
  onShare
}: SocialTextShareProps) {
  const [selectedText, setSelectedText] = useState('')
  const [showShare, setShowShare] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()

      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()

        if (rect) {
          setSelectedText(text)
          // Updated positioning logic
          const scrollX = window.scrollX || window.pageXOffset
          const scrollY = window.scrollY || window.pageYOffset
          
          // Calculate position relative to the viewport
          const x = rect.left + (rect.width / 2) + scrollX
          const y = rect.top + scrollY // Position above the selection
          
          setPosition({ x, y })
          setShowShare(true)
        }
      } else {
        setShowShare(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.social-text-share')) {
        setShowShare(false)
      }
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const copyText = async () => {
    await navigator.clipboard.writeText(selectedText)
    onCopy?.(selectedText)
    onShare?.(selectedText, 'copy')
    setShowShare(false)
  }

  const shareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedText)}`,
      '_blank'
    )
    onShare?.(selectedText, 'x')
    setShowShare(false)
  }

  return (
    <AnimatePresence>
      {showShare && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            position: 'absolute', // Changed from fixed to absolute
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -120%)', // Adjusted to appear above text
            background: theme.background,
            color: theme.text,
            borderColor: theme.border,
            zIndex: 9999, // Ensure it's always on top
          }}
          className={`social-text-share flex items-center gap-2 px-3 py-2 rounded-full 
            shadow-xl backdrop-blur-sm border ${className}`}
        >
          <button
            onClick={copyText}
            className="p-2 rounded-full transition-colors hover:bg-white/10"
            title="Copy to clipboard"
          >
            {customIcons?.copy || <FiCopy className="w-4 h-4" />}
          </button>
          <button
            onClick={shareOnX}
            className="p-2 rounded-full transition-colors hover:bg-white/10"
            title="Share on X"
          >
            {customIcons?.x || <RiTwitterXFill className="w-4 h-4" />}
          </button>
          <div className="w-px h-4" style={{ background: theme.border }} />
          <div className="flex items-center gap-1 text-sm opacity-75">
            {customIcons?.share || <FiShare2 className="w-3 h-3" />}
            <span>Share</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}