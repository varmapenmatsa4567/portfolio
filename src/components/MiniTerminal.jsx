import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  Minus,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react'

const HELP_COMMANDS = [
  { cmd: 'help', desc: 'Display all available commands' },
  { cmd: 'about', desc: 'Who is Chiranjeevi Varma Penmatsa?' },
  { cmd: 'skills', desc: 'List technical skills & stack breakdown' },
  { cmd: 'projects', desc: 'View live flagship & systems projects' },
  { cmd: 'experience', desc: 'Career journey and milestones' },
  { cmd: 'contact', desc: 'Direct contact info and links' },
  { cmd: 'cat resume.txt', desc: 'Quick view resume credentials' },
  { cmd: 'sudo hire', desc: 'Execute the hiring protocol ⚡' },
  { cmd: 'matrix', desc: 'Toggle digital matrix rain' },
  { cmd: 'theme <name>', desc: 'Change accent: cyan, purple, emerald, amber' },
  { cmd: 'whoami', desc: 'Check current terminal user' },
  { cmd: 'date', desc: 'Show current system time' },
  { cmd: 'clear', desc: 'Clear the terminal output' },
  { cmd: 'exit', desc: 'Close this terminal' },
]

const QUICK_ACTIONS = ['help', 'projects', 'skills', 'sudo hire', 'matrix']

const THEMES = {
  cyan: {
    accent: '#7c83fd',
    accent2: '#56ccf2',
    accent3: '#b47cff',
    grad: 'linear-gradient(100deg, #7c83fd, #56ccf2 55%, #b47cff)',
  },
  purple: {
    accent: '#b47cff',
    accent2: '#ff7ee5',
    accent3: '#7c83fd',
    grad: 'linear-gradient(100deg, #b47cff, #ff7ee5 55%, #7c83fd)',
  },
  emerald: {
    accent: '#00f2fe',
    accent2: '#4facfe',
    accent3: '#43e97b',
    grad: 'linear-gradient(100deg, #43e97b, #00f2fe 55%, #4facfe)',
  },
  amber: {
    accent: '#ffb347',
    accent2: '#ffcc33',
    accent3: '#ff7b54',
    grad: 'linear-gradient(100deg, #ff7b54, #ffb347 55%, #ffcc33)',
  },
}

function MatrixCanvas({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)

    const cols = Math.floor(w / 16) + 1
    const ypos = Array(cols).fill(0)

    const matrixChars = '0123456789ABCDEF0123456789CVP-REACT-JAVA-AWS-KAFKA'

    const render = () => {
      ctx.fillStyle = 'rgba(8, 8, 15, 0.12)'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#00ff88'
      ctx.font = '12pt monospace'

      ypos.forEach((y, ind) => {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
        const x = ind * 16
        ctx.fillText(text, x, y)
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0
        else ypos[ind] = y + 16
      })
      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)

    const handleResize = () => {
      if (!canvas) return
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
    }
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} className="terminal-matrix-canvas" />
}

export default function MiniTerminal({ isOpen, setIsOpen }) {
  const [history, setHistory] = useState([
    {
      type: 'system',
      content: (
        <div>
          <p className="term-welcome-title">
            <span className="term-accent">Chiranjeevi Varma OS</span> [Version 3.4.0-enterprise]
          </p>
          <p className="term-welcome-desc">
            Welcome to the interactive interactive terminal shell. Type <span className="term-cmd-highlight">help</span> to view available commands, or click the quick action chips below.
          </p>
        </div>
      ),
    },
  ])
  const [input, setInput] = useState('')
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [commandHistory, setCommandHistory] = useState([])
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMatrixActive, setIsMatrixActive] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isMatrixActive])

  // Global hotkey: backtick (`) or T to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '`' || e.key === '~') && !e.target.matches('input, textarea')) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  const applyTheme = (themeName) => {
    const theme = THEMES[themeName.toLowerCase()]
    if (!theme) return false
    const root = document.documentElement
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--accent-2', theme.accent2)
    root.style.setProperty('--accent-3', theme.accent3)
    root.style.setProperty('--grad', theme.grad)
    return true
  }

  const handleCommand = (rawCmd) => {
    const cmdClean = rawCmd.trim()
    if (!cmdClean) return

    setCommandHistory((prev) => [...prev, cmdClean])
    setHistoryIdx(-1)

    const parts = cmdClean.split(' ')
    const baseCmd = parts[0].toLowerCase()
    const args = parts.slice(1).join(' ')

    let output = null

    switch (baseCmd) {
      case 'help':
      case '?':
        output = (
          <div className="term-help-grid">
            <div className="term-table-header">
              <span>COMMAND</span>
              <span>DESCRIPTION</span>
            </div>
            {HELP_COMMANDS.map((item) => (
              <div key={item.cmd} className="term-table-row">
                <button
                  type="button"
                  className="term-chip-link"
                  onClick={() => handleCommand(item.cmd.replace(' <name>', ' cyan'))}
                >
                  {item.cmd}
                </button>
                <span className="term-text-muted">{item.desc}</span>
              </div>
            ))}
          </div>
        )
        break

      case 'about':
      case 'bio':
        output = (
          <div className="term-block">
            <p><strong>Chiranjeevi Varma Penmatsa</strong></p>
            <p className="term-text-muted">
              Full-Stack Developer with ~3.4 years of experience specializing in Java, Spring Boot, and modern React/Next.js architectures.
            </p>
            <p className="term-text-muted">
              By day, I build high-concurrency enterprise applications at TCS. By night, I experiment with AI drawing tools (AI Whiteboard), operating system browser simulations (VirtualOS), and distributed clones (IRCTC with Kafka & Redis).
            </p>
            <p className="term-highlight">Location: Hyderabad, India · AWS Certified Developer Associate</p>
          </div>
        )
        break

      case 'skills':
      case 'stack':
      case 'tech':
        output = (
          <div className="term-skills-block">
            <div className="term-skill-group">
              <span className="term-accent">Backend & Architecture:</span> Java, Spring Boot, Microservices, REST APIs, Kafka, Redis, Concurrency
            </div>
            <div className="term-skill-group">
              <span className="term-accent">Frontend & UI:</span> React, Next.js, TypeScript, JavaScript (ES6+), Canvas 2D, Tailwind CSS, Framer Motion
            </div>
            <div className="term-skill-group">
              <span className="term-accent">Cloud & DevOps:</span> AWS (Developer Associate Certified), Docker, CI/CD, Git
            </div>
            <div className="term-skill-group">
              <span className="term-accent">Databases:</span> PostgreSQL, MySQL, MongoDB, Redis Cache
            </div>
          </div>
        )
        break

      case 'projects':
      case 'work':
        output = (
          <div className="term-projects-list">
            <div className="term-proj-item">
              <div className="term-proj-title">
                <strong>1. AI Whiteboard (Flagship)</strong>
                <a
                  href="https://ai-whiteboard.chiranjeevipenmatsa.com"
                  target="_blank"
                  rel="noreferrer"
                  className="term-link"
                >
                  Live Demo <ExternalLink size={12} />
                </a>
              </div>
              <p className="term-text-muted">
                Step-by-step visual concept explainer using React, Canvas 2D, and OpenAI.
              </p>
            </div>

            <div className="term-proj-item">
              <div className="term-proj-title">
                <strong>2. VirtualOS (Systems)</strong>
                <a
                  href="https://virtualos.chiranjeevipenmatsa.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="term-link"
                >
                  Live Demo <ExternalLink size={12} />
                </a>
              </div>
              <p className="term-text-muted">
                Browser-based simulated OS exploring process management, memory virtuals, and desktop UI.
              </p>
            </div>

            <div className="term-proj-item">
              <div className="term-proj-title">
                <strong>3. IRCTC Clone (Distributed Backend)</strong>
                <a
                  href="https://github.com/varmapenmatsa4567/IRCTC-Clone"
                  target="_blank"
                  rel="noreferrer"
                  className="term-link"
                >
                  GitHub Repository <ExternalLink size={12} />
                </a>
              </div>
              <p className="term-text-muted">
                Scalable seat booking engine with Kafka event queues, Redis locks, and real-time PNR tracking.
              </p>
            </div>
          </div>
        )
        break

      case 'experience':
      case 'journey':
      case 'timeline':
        output = (
          <div className="term-block">
            <p><strong>💼 Jul 2023 — Present · System Engineer @ TCS</strong></p>
            <p className="term-text-muted">Building enterprise-grade Java & Spring Boot microservices with React web clients in Hyderabad.</p>
            <p><strong>☁️ Certification · AWS Certified Developer – Associate</strong></p>
            <p className="term-text-muted">Certified in designing, provisioning, and securing AWS serverless and cloud architectures.</p>
            <p><strong>🎓 2019 — 2023 · B.Tech in Computer Science</strong></p>
            <p className="term-text-muted">SRKR Engineering College, Bhimavaram.</p>
          </div>
        )
        break

      case 'contact':
      case 'email':
      case 'socials':
        output = (
          <div className="term-block">
            <p>
              📧 <strong>Email:</strong>{' '}
              <a href="mailto:varmapenmatsa4567@gmail.com" className="term-link">
                varmapenmatsa4567@gmail.com
              </a>
            </p>
            <p>
              🐙 <strong>GitHub:</strong>{' '}
              <a
                href="https://github.com/varmapenmatsa4567"
                target="_blank"
                rel="noreferrer"
                className="term-link"
              >
                github.com/varmapenmatsa4567 <ExternalLink size={12} />
              </a>
            </p>
            <p>📍 <strong>Location:</strong> Hyderabad, India</p>
          </div>
        )
        break

      case 'resume':
      case 'cat':
        if (baseCmd === 'cat' && args.toLowerCase() !== 'resume.txt' && args.toLowerCase() !== 'resume') {
          output = <p className="term-error">cat: {args}: No such file or directory. Try `cat resume.txt`</p>
        } else {
          output = (
            <div className="term-block term-resume-box">
              <p className="term-accent"><strong>=== RESUME SNAPSHOT ===</strong></p>
              <p><strong>Name:</strong> Chiranjeevi Varma Penmatsa</p>
              <p><strong>Role:</strong> Full-Stack Software Engineer (Java + React)</p>
              <p><strong>Experience:</strong> ~3.4 Years (TCS)</p>
              <p><strong>Certifications:</strong> AWS Certified Developer — Associate</p>
              <p><strong>Flagship Projects:</strong> AI Whiteboard, VirtualOS, IRCTC Microservices Clone</p>
              <p className="term-text-muted">
                Looking for impactful roles building high-scale distributed systems or intuitive interactive interfaces.
              </p>
              <a href="mailto:varmapenmatsa4567@gmail.com?subject=Job%20Opportunity%20for%20Chiranjeevi%20Varma" className="term-btn-action">
                Send Direct Email Offer <ArrowRight size={14} />
              </a>
            </div>
          )
        }
        break

      case 'sudo':
        if (args.toLowerCase() === 'hire' || args.toLowerCase() === 'hire me') {
          output = (
            <div className="term-hire-box">
              <p className="term-hire-title">🎉 [OFFER PROTOCOL INITIATED] 🎉</p>
              <pre className="term-ascii-art">
{`  _______________________________________
/ Great decision! Chiranjeevi is ready to \\
\\ bring full-stack magic to your team.  /
 ---------------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`}
              </pre>
              <p className="term-hire-text">
                ✓ Full-stack competency verified (Java + React + AWS)<br />
                ✓ Side-project velocity: high<br />
                ✓ System resilience: production tested<br />
              </p>
              <p>
                Let&apos;s schedule a chat:{' '}
                <a
                  href="mailto:varmapenmatsa4567@gmail.com?subject=Let's%20Connect%20-%20Opportunity"
                  className="term-hire-cta"
                >
                  varmapenmatsa4567@gmail.com
                </a>
              </p>
            </div>
          )
        } else {
          output = <p className="term-error">sudo: permission denied. But try running `sudo hire`!</p>
        }
        break

      case 'matrix':
        setIsMatrixActive((prev) => !prev)
        output = (
          <p className="term-success">
            Matrix mode {!isMatrixActive ? 'ENABLED. Wake up, Neo...' : 'DISABLED.'}
          </p>
        )
        break

      case 'theme':
        if (!args) {
          output = (
            <p className="term-text-muted">
              Usage: <span className="term-cmd-highlight">theme &lt;name&gt;</span> (Available: cyan, purple, emerald, amber)
            </p>
          )
        } else if (applyTheme(args)) {
          output = <p className="term-success">Palette updated to {args.toUpperCase()} mode! ✨</p>
        } else {
          output = (
            <p className="term-error">
              Unknown theme &apos;{args}&apos;. Choose from: cyan, purple, emerald, amber.
            </p>
          )
        }
        break

      case 'whoami':
        output = <p className="term-highlight">guest@cvp-portfolio (Innovator & Future Collaborator)</p>
        break

      case 'date':
        output = <p>{new Date().toString()}</p>
        break

      case 'clear':
      case 'cls':
        setHistory([])
        setInput('')
        return

      case 'echo':
        output = <p>{args || ''}</p>
        break

      case 'exit':
      case 'quit':
        setIsOpen(false)
        setInput('')
        return

      default:
        output = (
          <p className="term-error">
            Command not found: &apos;{baseCmd}&apos;. Type <span className="term-cmd-highlight">help</span> for available commands.
          </p>
        )
    }

    setHistory((prev) => [
      ...prev,
      { type: 'command', cmd: cmdClean },
      { type: 'output', content: output },
    ])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const nextIdx = historyIdx + 1 < commandHistory.length ? historyIdx + 1 : historyIdx
        setHistoryIdx(nextIdx)
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1
        setHistoryIdx(nextIdx)
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '')
      } else if (historyIdx === 0) {
        setHistoryIdx(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matching = HELP_COMMANDS.map((c) => c.cmd.split(' ')[0]).filter((c) =>
        c.startsWith(input.trim().toLowerCase())
      )
      if (matching.length === 1) {
        setInput(matching[0])
      }
    }
  }

  return (
    <>
      {/* Floating terminal trigger button */}
      <motion.button
        className="term-floating-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Open interactive terminal (Press ` or ~)"
        aria-label="Toggle Interactive Terminal"
      >
        <div className="term-btn-inner">
          <TerminalIcon size={17} className="term-btn-icon" />
          <span className="term-btn-label mono">~/$ cvp</span>
          <span className="term-btn-ping" />
        </div>
      </motion.button>

      {/* Terminal Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="term-overlay" onClick={() => setIsOpen(false)}>
            <motion.div
              className={`term-window ${isMaximized ? 'maximized' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.focus()
              }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            >
              {/* Matrix Canvas Layer */}
              <MatrixCanvas active={isMatrixActive} />

              {/* Title bar */}
              <div className="term-titlebar">
                <div className="term-dots">
                  <button
                    className="term-dot dot-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close terminal"
                  />
                  <button
                    className="term-dot dot-min"
                    onClick={() => setIsOpen(false)}
                    aria-label="Minimize terminal"
                  />
                  <button
                    className="term-dot dot-max"
                    onClick={() => setIsMaximized((prev) => !prev)}
                    aria-label="Maximize terminal"
                  />
                </div>
                <div className="term-title mono">
                  <TerminalIcon size={14} /> chiranjeevi@portfolio:~ (zsh)
                </div>
                <div className="term-actions">
                  <button
                    className="term-action-icon"
                    onClick={() => {
                      setHistory([])
                      setIsMatrixActive(false)
                    }}
                    title="Reset Terminal"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    className="term-action-icon"
                    onClick={() => setIsMaximized((prev) => !prev)}
                    title={isMaximized ? 'Restore' : 'Maximize'}
                  >
                    {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                  <button
                    className="term-action-icon"
                    onClick={() => setIsOpen(false)}
                    title="Close (Esc)"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="term-chips">
                <span className="term-chips-label mono">Quick:</span>
                {QUICK_ACTIONS.map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    className="term-chip"
                    onClick={() => handleCommand(cmd)}
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Terminal Body */}
              <div className="term-body mono">
                {history.map((item, i) => {
                  if (item.type === 'system') {
                    return (
                      <div key={i} className="term-line-system">
                        {item.content}
                      </div>
                    )
                  }
                  if (item.type === 'command') {
                    return (
                      <div key={i} className="term-line-cmd">
                        <span className="term-prompt">
                          <span className="term-user">cvp@mac</span>:<span className="term-path">~</span>$
                        </span>
                        <span className="term-cmd-text">{item.cmd}</span>
                      </div>
                    )
                  }
                  return (
                    <div key={i} className="term-line-output">
                      {item.content}
                    </div>
                  )
                })}

                {/* Active Prompt Line */}
                <div className="term-input-row">
                  <span className="term-prompt">
                    <span className="term-user">cvp@mac</span>:<span className="term-path">~</span>$
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="term-input"
                    spellCheck="false"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <div ref={bottomRef} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
