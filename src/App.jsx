import { useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Github, Mail, ArrowUpRight, Sparkles, Code2, Database, Cloud,
  Terminal, Cpu, Braces, MapPin, GraduationCap, Briefcase, BadgeCheck,
  PenLine, CheckSquare, MonitorDot, ChevronDown, Activity, Search,
} from 'lucide-react'
import ParticleField from './components/ParticleField.jsx'
import Typer from './components/Typer.jsx'
import Reveal from './components/Reveal.jsx'
import TiltCard from './components/TiltCard.jsx'
import SpotlightCard from './components/SpotlightCard.jsx'
import MiniTerminal from './components/MiniTerminal.jsx'
import Counter from './components/Counter.jsx'
import JourneyTimeline from './components/JourneyTimeline.jsx'
import FloatingTechLayer from './components/FloatingTechLayer.jsx'
import ArchitectureFlow from './components/ArchitectureFlow.jsx'
import InteractiveSkills from './components/InteractiveSkills.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import ContactModal from './components/ContactModal.jsx'

const PROJECTS = [
  {
    icon: PenLine,
    tag: 'Flagship',
    name: 'AI Whiteboard',
    url: 'https://ai-whiteboard.chiranjeevipenmatsa.com',
    linkLabel: 'ai-whiteboard.chiranjeevipenmatsa.com',
    desc: 'An AI teaching whiteboard. Give it a prompt — "draw a car", "explain a triangle" — and it draws step by step while narrating the concept, with replay, multi-page boards and multi-language explanations.',
    stack: ['React', 'Next.js', 'Canvas 2D', 'Open AI'],
    featured: true,
  },
  {
    icon: MonitorDot,
    tag: 'Systems',
    name: 'VirtualOS',
    url: "https://virtualos.chiranjeevipenmatsa.com/",
    linkLabel: "https://virtualos.chiranjeevipenmatsa.com/",
    desc: 'A simulated operating-system environment in the browser — exploring how processes, memory and a desktop UI can live inside a web app.',
    stack: ['React', 'JavaScript', 'Next.js', 'Tailwind CSS'],
  },
  {
    icon: CheckSquare,
    tag: 'Distributed Systems',
    name: 'IRCTC Clone',
    url: 'https://github.com/varmapenmatsa4567/IRCTC-Clone',
    linkLabel: 'github.com/varmapenmatsa4567/IRCTC-Clone',
    desc: 'Built a scalable IRCTC clone with microservices, concurrency-safe seat booking, automated waitlist upgrades, and real-time PNR tracking.',
    stack: ['Java', 'Spring Boot', 'React.js', 'Next.js', 'Kafka', 'Redis', 'PostgreSQL'],
    hasSimulator: true,
  },
]

const MARQUEE = ['Java', 'Spring Boot', 'React', 'AWS', 'TypeScript', 'Microservices', 'REST APIs', 'SQL', 'Vite', 'Next.js', 'Git', 'Canvas 2D']

function Nav({ onOpenTerminal, onOpenPalette, onOpenContact }) {
  return (
    <header className="nav">
      <a className="nav-logo" href="#top">CVP<span>.</span></a>
      <nav>
        <a href="#work">Work</a>
        <a href="#skills">Skills</a>
        <a href="#journey">Journey</a>
        <button
          type="button"
          className="nav-palette-link mono"
          onClick={onOpenPalette}
          title="Open Command Palette (Cmd+K / Ctrl+K)"
        >
          <Search size={13} /> <span className="nav-kbd">⌘K</span>
        </button>
        <button
          type="button"
          className="nav-term-link mono"
          onClick={onOpenTerminal}
          title="Open Interactive CLI (press `)"
        >
          <Terminal size={14} /> CLI
        </button>
        <button
          type="button"
          className="nav-cta"
          onClick={onOpenContact}
        >
          Say hello
        </button>
      </nav>
    </header>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 600], [0, 120])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <section className="hero" id="top">
      <motion.div className="hero-bg" style={{ y: yBg }}>
        <ParticleField />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
      </motion.div>
      <FloatingTechLayer />
      <motion.div className="hero-inner" style={{ opacity }}>
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles size={15} /> Hi, I&apos;m
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Chiranjeevi Varma
          <span className="hero-name-sub">Penmatsa</span>
        </motion.h1>
        <motion.div
          className="hero-typer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Typer
            phrases={[
              'Full-stack developer.',
              'Java + ReactJS, end to end.',
              'I build things that teach.',
              'AWS-certified cloud builder.',
            ]}
          />
        </motion.div>
        <motion.p
          className="hero-blurb"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          ~3.4 years crafting enterprise apps by day and shipping side projects by night —
          currently obsessed with an AI that draws to teach.
        </motion.p>
        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          <a className="btn btn-primary" href="#work">
            See my work <ArrowUpRight size={16} />
          </a>
          <a className="btn btn-ghost" href="https://github.com/varmapenmatsa4567" target="_blank" rel="noreferrer">
            <Github size={16} /> GitHub
          </a>
        </motion.div>
        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <span><MapPin size={13} /> Hyderabad, India</span>
          <span className="dot" />
          <span><BadgeCheck size={13} /> AWS Developer Associate</span>
        </motion.div>
      </motion.div>
      <motion.a
        href="#about"
        className="scroll-hint"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        aria-label="Scroll down"
      >
        <ChevronDown size={20} />
      </motion.a>
    </section>
  )
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className="marquee-item">{t}<i>✦</i></span>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <section className="section" id="about">
      <Reveal>
        <p className="section-kicker">01 — About</p>
        <h2>Engineer by trade, <span className="grad-text">builder by instinct.</span></h2>
      </Reveal>
      <div className="about-grid">
        <Reveal delay={0.1}>
          <p className="about-lead">
            I&apos;m a full-stack developer who likes owning the whole pipeline — from a
            Spring Boot service to the React screen in front of it. At TCS I build and
            maintain enterprise applications; at home I build the weird, fun ideas I can&apos;t
            stop thinking about.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="about-facts">
          <SpotlightCard className="fact" tilt={false} spotlightRadius={240}>
            <strong>
              <Counter from={0} to={3.4} decimals={1} suffix="+" />
            </strong>
            <span>years shipping code</span>
          </SpotlightCard>
          <SpotlightCard className="fact" tilt={false} spotlightRadius={240}>
            <strong>AWS</strong><span>Developer Associate</span>
          </SpotlightCard>
          <SpotlightCard className="fact" tilt={false} spotlightRadius={240}>
            <strong>B.Tech</strong><span>CSE, SRKR Bhimavaram</span>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  )
}

function Work({ showArchSim, setShowArchSim }) {
  return (
    <section className="section" id="work">
      <Reveal>
        <p className="section-kicker">02 — Selected work</p>
        <h2>Things I&apos;ve <span className="grad-text">built.</span></h2>
      </Reveal>
      <div className="projects">
        {PROJECTS.map((p, i) => {
          const Icon = p.icon
          const inner = (
            <>
              <div className="proj-head">
                <span className="proj-icon"><Icon size={22} /></span>
                <span className="proj-tag">{p.tag}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="proj-desc">{p.desc}</p>
              <div className="proj-stack">
                {p.stack.map((s) => <span key={s}>{s}</span>)}
              </div>
              <div className="proj-actions">
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="proj-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {p.linkLabel} <ArrowUpRight size={14} />
                  </a>
                )}
                {p.hasSimulator && (
                  <button
                    type="button"
                    className={`proj-sim-btn ${showArchSim ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowArchSim((prev) => !prev)
                    }}
                  >
                    <Activity size={13} /> {showArchSim ? 'Hide Flow Simulator' : '✨ Live Architecture Flow'}
                  </button>
                )}
              </div>
            </>
          )
          return (
            <Reveal key={p.name} delay={i * 0.12} className={p.featured ? 'proj-span' : ''}>
              <TiltCard className={`proj-card ${p.featured ? 'featured' : ''}`}>
                {inner}
              </TiltCard>
            </Reveal>
          )
        })}
      </div>

      {/* Expandable Architecture Flow Simulator */}
      <AnimatePresence>
        {showArchSim && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <ArchitectureFlow />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Skills() {
  return (
    <section className="section" id="skills">
      <Reveal>
        <p className="section-kicker">03 — Toolbox</p>
        <h2>What I <span className="grad-text">work with.</span></h2>
      </Reveal>
      <InteractiveSkills />
    </section>
  )
}

function Journey() {
  return (
    <section className="section" id="journey">
      <Reveal>
        <p className="section-kicker">04 — Journey</p>
        <h2>The road <span className="grad-text">so far.</span></h2>
      </Reveal>
      <JourneyTimeline />
    </section>
  )
}

function Contact({ onOpenContact }) {
  return (
    <section className="section contact" id="contact">
      <Reveal>
        <p className="section-kicker">05 — Contact</p>
        <h2>Let&apos;s build something <span className="grad-text">interesting.</span></h2>
        <p className="contact-lead">
          My inbox is open for interesting problems, collaborations, or just a good tech conversation.
        </p>
        <div className="contact-ctas">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenContact}
          >
            <Sparkles size={16} /> Send a Message & Fire Confetti 🎉
          </button>
          <a className="btn btn-ghost" href="mailto:varmapenmatsa4567@gmail.com">
            <Mail size={16} /> varmapenmatsa4567@gmail.com
          </a>
          <a className="btn btn-ghost" href="https://github.com/varmapenmatsa4567" target="_blank" rel="noreferrer">
            <Github size={16} /> varmapenmatsa4567
          </a>
        </div>
      </Reveal>
    </section>
  )
}

export default function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [showArchSim, setShowArchSim] = useState(false)

  return (
    <>
      <FloatingTechLayer />
      <Nav
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Work
          showArchSim={showArchSim}
          setShowArchSim={setShowArchSim}
        />
        <Skills />
        <Journey />
        <Contact onOpenContact={() => setIsContactOpen(true)} />
      </main>
      <footer className="footer">
        <span>Designed & built by Chiranjeevi Varma Penmatsa</span>
        <span className="mono">© {new Date().getFullYear()} · chiranjeevipenmatsa.com</span>
      </footer>

      {/* Global Interactive Overlays */}
      <MiniTerminal isOpen={isTerminalOpen} setIsOpen={setIsTerminalOpen} />
      <CommandPalette
        isOpen={isPaletteOpen}
        setIsOpen={setIsPaletteOpen}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onToggleSimulator={() => setShowArchSim((prev) => !prev)}
      />
      <ContactModal isOpen={isContactOpen} setIsOpen={setIsContactOpen} />
    </>
  )
}
