import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Code2,
  Cloud,
  Cpu,
  Database,
  Terminal,
  Braces,
  Layers,
  Sparkles,
} from 'lucide-react'

const HERO_FLOATING_BADGES = [
  {
    icon: Braces,
    label: 'Java · Spring Boot',
    top: '22%',
    left: '6%',
    speed: 0.15,
    floatDuration: 6.2,
    color: '#7c83fd',
  },
  {
    icon: Code2,
    label: 'React · Next.js',
    top: '24%',
    right: '6%',
    speed: 0.22,
    floatDuration: 7.0,
    color: '#56ccf2',
  },
  {
    icon: Cloud,
    label: 'AWS Certified',
    top: '64%',
    left: '8%',
    speed: 0.18,
    floatDuration: 8.2,
    color: '#ffb347',
  },
  {
    icon: Cpu,
    label: 'Kafka & Redis',
    top: '62%',
    right: '8%',
    speed: 0.25,
    floatDuration: 6.6,
    color: '#b47cff',
  },
  {
    icon: Layers,
    label: 'Microservices',
    top: '80%',
    left: '15%',
    speed: 0.12,
    floatDuration: 7.5,
    color: '#00ff88',
  },
]

export default function FloatingTechLayer() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 450], [1, 0])

  return (
    <motion.div className="floating-tech-container" style={{ opacity }} aria-hidden="true">
      {HERO_FLOATING_BADGES.map((badge, i) => {
        const Icon = badge.icon
        const yOffset = useTransform(
          scrollY,
          [0, 500],
          [0, -120 * badge.speed]
        )

        return (
          <motion.div
            key={badge.label}
            className="floating-tech-badge"
            style={{
              top: badge.top,
              left: badge.left,
              right: badge.right,
              y: yOffset,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -12, 0],
              rotate: [0, i % 2 === 0 ? 2 : -2, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.3 + i * 0.1 },
              scale: { duration: 0.8, delay: 0.3 + i * 0.1 },
              y: { repeat: Infinity, duration: badge.floatDuration, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: badge.floatDuration, ease: 'easeInOut' },
            }}
          >
            <div
              className="floating-badge-inner"
              style={{ '--badge-glow': badge.color }}
            >
              <Icon size={14} className="floating-badge-icon" />
              <span className="mono">{badge.label}</span>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
