import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  Braces,
  Code2,
  Database,
  Cloud,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  GitBranch,
  Network,
  Globe,
} from 'lucide-react'
import SpotlightCard from './SpotlightCard.jsx'

const SKILL_CATEGORIES = [
  { id: 'all', label: 'All Skills' },
  { id: 'backend', label: 'Backend & Systems' },
  { id: 'frontend', label: 'Frontend & UI' },
  { id: 'cloud', label: 'Cloud & DevOps' },
  { id: 'database', label: 'Data & Cache' },
]

const SKILLS_DATA = [
  {
    id: 'java',
    name: 'Java 17/21',
    category: 'backend',
    level: 'Core Language · Production Daily',
    icon: Braces,
    color: '#ff7b54',
    connections: ['springboot', 'microservices', 'kafka', 'postgres', 'redis'],
    synergyNote: 'Core OOP, multi-threading, concurrency locks & stream pipelines.',
  },
  {
    id: 'springboot',
    name: 'Spring Boot 3',
    category: 'backend',
    level: 'Enterprise Framework',
    icon: Layers,
    color: '#00ff88',
    connections: ['java', 'microservices', 'postgres', 'redis', 'kafka', 'aws'],
    synergyNote: 'Spring Cloud Gateway, Feign RPC, Spring Data JPA & Eureka Discovery.',
  },
  {
    id: 'react',
    name: 'React 18 & Next.js',
    category: 'frontend',
    level: 'Frontend Core · Full-Stack',
    icon: Code2,
    color: '#56ccf2',
    connections: ['typescript', 'javascript', 'tailwind', 'canvas'],
    synergyNote: 'Server components, hooks, optimized rendering & responsive design.',
  },
  {
    id: 'microservices',
    name: 'Microservices & Distributed',
    category: 'backend',
    level: 'System Architecture',
    icon: Cpu,
    color: '#b47cff',
    connections: ['springboot', 'java', 'kafka', 'redis', 'postgres', 'aws'],
    synergyNote: 'Saga orchestrations, distributed tracing, circuit breakers & Eureka discovery.',
  },
  {
    id: 'aws',
    name: 'AWS Cloud',
    category: 'cloud',
    level: 'Developer Associate Certified',
    icon: Cloud,
    color: '#ffb347',
    connections: ['springboot', 'docker', 'postgres', 'microservices'],
    synergyNote: 'Certified in Lambda, S3, DynamoDB, API Gateway, CloudWatch & IAM.',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL & SQL',
    category: 'database',
    level: 'ACID Persistence Tier',
    icon: Database,
    color: '#3390ec',
    connections: ['springboot', 'java', 'redis', 'microservices'],
    synergyNote: 'Database-per-service pattern, indexing, optimistic/pessimistic locking.',
  },
  {
    id: 'redis',
    name: 'Redis Cache & Locks',
    category: 'database',
    level: 'In-Memory State & Caching',
    icon: Zap,
    color: '#ff5f56',
    connections: ['springboot', 'java', 'postgres', 'microservices'],
    synergyNote: 'High-speed bitmask caches, TTL keys & distributed concurrency locking.',
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    category: 'backend',
    level: 'Event Streaming & Queues',
    icon: Activity,
    color: '#00f2fe',
    connections: ['springboot', 'java', 'microservices'],
    synergyNote: 'Partitioned event buses for decoupled async notifications & booking logs.',
  },
  {
    id: 'typescript',
    name: 'TypeScript & JavaScript',
    category: 'frontend',
    level: 'Daily Driver (ES6+)',
    icon: Terminal,
    color: '#3178c6',
    connections: ['react', 'nextjs', 'tailwind', 'canvas'],
    synergyNote: 'Type-safe state management, async/await streams & modern web APIs.',
  },
  {
    id: 'canvas',
    name: 'Canvas 2D & Graphics',
    category: 'frontend',
    level: 'AI Whiteboard Engine',
    icon: Sparkles,
    color: '#ff7ee5',
    connections: ['react', 'javascript', 'typescript'],
    synergyNote: 'Pixel manipulation, path math & step-by-step vector drawing animations.',
  },
  {
    id: 'docker',
    name: 'Docker & CI/CD',
    category: 'cloud',
    level: 'Containerization & Ops',
    icon: GitBranch,
    color: '#2496ed',
    connections: ['aws', 'springboot', 'microservices'],
    synergyNote: 'Multi-stage Docker builds, container orchestration & GitHub Actions.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS & Framer',
    category: 'frontend',
    level: 'Modern UI & Animations',
    icon: Globe,
    color: '#38bdf8',
    connections: ['react', 'typescript', 'javascript'],
    synergyNote: 'Glassmorphic styling, design systems & fluid spring micro-interactions.',
  },
]

export default function InteractiveSkills() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredSkill, setHoveredSkill] = useState(null)

  const filteredSkills =
    activeCategory === 'all'
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === activeCategory)

  const activeConnections = hoveredSkill ? hoveredSkill.connections : []

  return (
    <div className="skills-interactive-container">
      {/* Category Tabs with Animated Spring Pill Indicator */}
      <div className="skills-toolbar">
        <LayoutGroup>
          <div className="skills-category-tabs">
            {SKILL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`skill-cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSkillCategory"
                      className="skill-cat-active-bg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="skill-cat-label">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* Interactive Grid with Tech Stack Synergy Node Glow on Hover */}
      <LayoutGroup>
        <motion.div layout className="skills-interactive-grid">
          <AnimatePresence>
            {filteredSkills.map((skill) => {
              const Icon = skill.icon
              const isHovered = hoveredSkill?.id === skill.id
              const isConnected = activeConnections.includes(skill.id)
              const isDimmed = hoveredSkill && !isHovered && !isConnected

              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{
                    opacity: isDimmed ? 0.35 : 1,
                    scale: isHovered ? 1.03 : 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    layout: { type: 'spring', stiffness: 350, damping: 28 },
                    opacity: { duration: 0.2 },
                  }}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => setHoveredSkill((prev) => (prev?.id === skill.id ? null : skill))}
                  className="skill-card-wrapper"
                >
                  <SpotlightCard
                    className={`interactive-skill-card ${isHovered ? 'hovered' : ''} ${
                      isConnected ? 'connected-glow' : ''
                    }`}
                    tilt={false}
                    spotlightRadius={280}
                    style={{ '--card-accent': skill.color }}
                  >
                    <div className="skill-header">
                      <div
                        className="skill-icon-wrap"
                        style={{ backgroundColor: `${skill.color}15`, borderColor: `${skill.color}35` }}
                      >
                        <Icon size={20} style={{ color: skill.color }} />
                      </div>
                      {isHovered && (
                        <span className="skill-badge-hl mono">Active Node</span>
                      )}
                      {isConnected && !isHovered && (
                        <span className="skill-badge-synergy mono">✦ Synergistic</span>
                      )}
                    </div>

                    <div className="skill-info">
                      <strong className="skill-title">{skill.name}</strong>
                      <span className="skill-level">{skill.level}</span>
                    </div>

                    <p className="skill-desc">{skill.synergyNote}</p>
                  </SpotlightCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Active Synergy Legend Info */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            className="skills-synergy-legend"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="legend-icon-badge">
              <Network size={16} style={{ color: hoveredSkill.color }} />
            </div>
            <div className="legend-text">
              <strong>{hoveredSkill.name} Ecosystem Synergy:</strong>{' '}
              <span>
                Connected to {hoveredSkill.connections.length} synergistic tools across the stack. {hoveredSkill.synergyNote}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
