import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  Terminal,
  Mail,
  Copy,
  Check,
  Github,
  ExternalLink,
  Code2,
  Compass,
  Layers,
  Palette,
  PartyPopper,
  X,
  CornerDownLeft,
  Linkedin,
} from 'lucide-react'
import { fireGrandConfetti } from '../utils/confetti.js'

export default function CommandPalette({
  isOpen,
  setIsOpen,
  onOpenTerminal,
  onOpenContact,
  onToggleSimulator,
}) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [activeTheme, setActiveTheme] = useState('default')
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Listen for global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const copyEmail = () => {
    navigator.clipboard.writeText('varmapenmatsa4567@gmail.com')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
    setIsOpen(false)
  }

  const cycleTheme = () => {
    const themes = ['default', 'cyber', 'solar', 'emerald', 'rose']
    const nextIdx = (themes.indexOf(activeTheme) + 1) % themes.length
    const next = themes[nextIdx]
    setActiveTheme(next)

    if (next === 'default') {
      document.documentElement.style.removeProperty('--accent')
      document.documentElement.style.removeProperty('--accent-2')
    } else if (next === 'cyber') {
      document.documentElement.style.setProperty('--accent', '#00ffcc')
      document.documentElement.style.setProperty('--accent-2', '#ff007f')
    } else if (next === 'solar') {
      document.documentElement.style.setProperty('--accent', '#ff9900')
      document.documentElement.style.setProperty('--accent-2', '#ffdd00')
    } else if (next === 'emerald') {
      document.documentElement.style.setProperty('--accent', '#00ff88')
      document.documentElement.style.setProperty('--accent-2', '#56ccf2')
    } else if (next === 'rose') {
      document.documentElement.style.setProperty('--accent', '#ff4b8b')
      document.documentElement.style.setProperty('--accent-2', '#9d4edd')
    }
    setIsOpen(false)
  }

  const navigateTo = (selector) => {
    setIsOpen(false)
    const el = document.querySelector(selector)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const commands = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-top',
        category: 'Navigation',
        icon: Compass,
        title: 'Home / Hero',
        subtitle: 'Back to top overview & bio',
        action: () => navigateTo('#top'),
        shortcut: 'G H',
      },
      {
        id: 'nav-about',
        category: 'Navigation',
        icon: Compass,
        title: 'About Me',
        subtitle: 'Philosophy, metrics & background',
        action: () => navigateTo('#about'),
        shortcut: 'G A',
      },
      {
        id: 'nav-work',
        category: 'Navigation',
        icon: Compass,
        title: 'Projects & Work',
        subtitle: 'AI Whiteboard, VirtualOS & IRCTC Clone',
        action: () => navigateTo('#work'),
        shortcut: 'G W',
      },
      {
        id: 'nav-skills',
        category: 'Navigation',
        icon: Compass,
        title: 'Skills & Toolbox',
        subtitle: 'Tech stack synergy graph & tools',
        action: () => navigateTo('#skills'),
        shortcut: 'G S',
      },
      {
        id: 'nav-journey',
        category: 'Navigation',
        icon: Compass,
        title: 'Journey & Milestones',
        subtitle: 'Experience, education & AWS certification',
        action: () => navigateTo('#journey'),
        shortcut: 'G J',
      },
      {
        id: 'nav-contact',
        category: 'Navigation',
        icon: Compass,
        title: 'Contact Section',
        subtitle: 'Get in touch & collaborative opportunities',
        action: () => navigateTo('#contact'),
        shortcut: 'G C',
      },

      // Actions
      {
        id: 'act-contact-modal',
        category: 'Actions',
        icon: Mail,
        title: 'Send a Direct Message',
        subtitle: 'Open the interactive contact form with confetti effect',
        action: () => {
          setIsOpen(false)
          if (onOpenContact) onOpenContact()
        },
        badge: 'Recommended',
      },
      {
        id: 'act-copy-email',
        category: 'Actions',
        icon: copiedEmail ? Check : Copy,
        title: copiedEmail ? 'Email Copied!' : 'Copy Email Address',
        subtitle: 'varmapenmatsa4567@gmail.com',
        action: copyEmail,
      },
      {
        id: 'act-linkedin',
        category: 'Actions',
        icon: Linkedin,
        title: 'Open LinkedIn Profile',
        subtitle: 'linkedin.com/in/chiranjeevi-varma-penmatsa',
        action: () => {
          window.open('https://www.linkedin.com/in/chiranjeevi-varma-penmatsa', '_blank')
          setIsOpen(false)
        },
      },
      {
        id: 'act-github',
        category: 'Actions',
        icon: Github,
        title: 'Open GitHub Profile',
        subtitle: 'github.com/varmapenmatsa4567',
        action: () => {
          window.open('https://github.com/varmapenmatsa4567', '_blank')
          setIsOpen(false)
        },
      },
      {
        id: 'act-proj-ai',
        category: 'Projects',
        icon: Sparkles,
        title: 'Launch Flagship: AI Whiteboard',
        subtitle: 'ai-whiteboard.chiranjeevipenmatsa.com',
        action: () => {
          window.open('https://ai-whiteboard.chiranjeevipenmatsa.com', '_blank')
          setIsOpen(false)
        },
      },
      {
        id: 'act-proj-virtualos',
        category: 'Projects',
        icon: Code2,
        title: 'Launch Project: VirtualOS',
        subtitle: 'virtualos.chiranjeevipenmatsa.com',
        action: () => {
          window.open('https://virtualos.chiranjeevipenmatsa.com/', '_blank')
          setIsOpen(false)
        },
      },
      {
        id: 'act-proj-irctc',
        category: 'Projects',
        icon: Layers,
        title: 'View IRCTC Clone Repository',
        subtitle: 'github.com/varmapenmatsa4567/IRCTC-Clone',
        action: () => {
          window.open('https://github.com/varmapenmatsa4567/IRCTC-Clone', '_blank')
          setIsOpen(false)
        },
      },

      // Developer Tools
      {
        id: 'tool-terminal',
        category: 'Developer Tools',
        icon: Terminal,
        title: 'Launch Interactive CLI Shell (~/$ cvp)',
        subtitle: 'Full terminal with custom commands & Easter eggs',
        action: () => {
          setIsOpen(false)
          if (onOpenTerminal) onOpenTerminal()
        },
        shortcut: '`',
      },
      {
        id: 'tool-sim',
        category: 'Developer Tools',
        icon: Layers,
        title: 'Toggle IRCTC Architecture & Trace Simulator',
        subtitle: 'Interactive multi-service topology diagram and saga traces',
        action: () => {
          setIsOpen(false)
          if (onToggleSimulator) onToggleSimulator()
          navigateTo('#work')
        },
      },
      {
        id: 'tool-confetti',
        category: 'Developer Tools',
        icon: PartyPopper,
        title: 'Trigger Confetti Cannon Celebration',
        subtitle: 'Celebrate with grand 60fps canvas particle physics',
        action: () => {
          fireGrandConfetti()
          setIsOpen(false)
        },
      },
      {
        id: 'tool-theme',
        category: 'Developer Tools',
        icon: Palette,
        title: `Cycle Color Theme (Current: ${activeTheme})`,
        subtitle: 'Switch between Obsidian, Cyber, Solar, Emerald & Rose',
        action: cycleTheme,
      },
    ],
    [copiedEmail, activeTheme, onOpenTerminal, onOpenContact, onToggleSimulator]
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase().trim()
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }, [commands, query])

  // Handle keyboard navigation inside the palette
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action()
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`.palette-item.active`)
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Group filtered items by category
  const categories = useMemo(() => {
    const cats = {}
    filtered.forEach((item, index) => {
      if (!cats[item.category]) cats[item.category] = []
      cats[item.category].push({ ...item, globalIndex: index })
    })
    return cats
  }, [filtered])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="palette-backdrop" onClick={() => setIsOpen(false)}>
          <motion.div
            className="palette-modal"
            initial={{ opacity: 0, scale: 0.94, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Header */}
            <div className="palette-search-box">
              <Search className="palette-search-icon" size={20} />
              <input
                ref={inputRef}
                type="text"
                className="palette-input"
                placeholder="Type a command or search sections, projects, tools..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
              />
              {query && (
                <button
                  type="button"
                  className="palette-clear-btn"
                  onClick={() => {
                    setQuery('')
                    setSelectedIndex(0)
                  }}
                >
                  <X size={16} />
                </button>
              )}
              <span className="palette-kbd mono">ESC</span>
            </div>

            {/* Results List */}
            <div className="palette-list" ref={listRef}>
              {filtered.length === 0 ? (
                <div className="palette-empty">
                  <p>No results found for &ldquo;{query}&rdquo;</p>
                  <span>Try searching for &apos;projects&apos;, &apos;email&apos;, &apos;skills&apos;, or &apos;theme&apos;</span>
                </div>
              ) : (
                Object.entries(categories).map(([catName, items]) => (
                  <div key={catName} className="palette-category-group">
                    <div className="palette-cat-header mono">{catName}</div>
                    {items.map((item) => {
                      const Icon = item.icon
                      const isActive = selectedIndex === item.globalIndex
                      return (
                        <div
                          key={item.id}
                          className={`palette-item ${isActive ? 'active' : ''}`}
                          onClick={() => item.action()}
                          onMouseEnter={() => setSelectedIndex(item.globalIndex)}
                        >
                          <div className="palette-item-icon">
                            <Icon size={18} />
                          </div>
                          <div className="palette-item-content">
                            <div className="palette-item-title-row">
                              <span className="palette-item-title">{item.title}</span>
                              {item.badge && (
                                <span className="palette-item-badge mono">{item.badge}</span>
                              )}
                            </div>
                            <span className="palette-item-subtitle">{item.subtitle}</span>
                          </div>
                          {item.shortcut ? (
                            <span className="palette-shortcut mono">{item.shortcut}</span>
                          ) : (
                            <CornerDownLeft
                              size={14}
                              className={`palette-enter-icon ${isActive ? 'visible' : ''}`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="palette-footer">
              <div className="palette-hint">
                <span className="palette-kbd mono">↑</span>
                <span className="palette-kbd mono">↓</span>
                <span>to navigate</span>
              </div>
              <div className="palette-hint">
                <span className="palette-kbd mono">↵</span>
                <span>to select</span>
              </div>
              <div className="palette-hint">
                <span className="palette-kbd mono">ESC</span>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
