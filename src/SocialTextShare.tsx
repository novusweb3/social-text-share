import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShare2, FiCopy, FiTwitter } from 'react-icons/fi'

export interface SocialTextShareProps {
  className?: string
  customIcons?: {
    copy?: React.ReactNode
    twitter?: React.ReactNode
    share?: React.ReactNode
  }
  theme?: {
    background?: string
    text?: string
    border?: string
    hoverBg?: string
  }
  onCopy?: (text: string) => void
  onShare?: (text: string, platform: 'twitter' | 'copy') => void
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
          setPosition({
            x: rect.left + (rect.width / 2),
            y: rect.top - 10 + window.scrollY
          })
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

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedText)}`,
      '_blank'
    )
    onShare?.(selectedText, 'twitter')
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
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)',
            background: theme.background,
            color: theme.text,
            borderColor: theme.border,
          }}
          className={`social-text-share z-[100] flex items-center gap-2 px-3 py-2 rounded-full 
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
            onClick={shareOnTwitter}
            className="p-2 rounded-full transition-colors hover:bg-white/10"
            title="Share on Twitter"
          >
            {customIcons?.twitter || <FiTwitter className="w-4 h-4" />}
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