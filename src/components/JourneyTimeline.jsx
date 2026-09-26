import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Briefcase, BadgeCheck, GraduationCap } from 'lucide-react'
import SpotlightCard from './SpotlightCard.jsx'
import Reveal from './Reveal.jsx'

const MILESTONES = [
  {
    icon: Briefcase,
    badge: 'Experience',
    period: 'Jul 2023 — Present',
    title: 'System Engineer · TCS',
    location: 'Hyderabad, India',
    desc: 'Building and maintaining full-stack enterprise applications with Java, Spring Boot microservices and ReactJS frontend clients for production systems used at scale.',
    skills: ['Java', 'Spring Boot', 'ReactJS', 'Microservices', 'REST APIs'],
  },
  {
    icon: BadgeCheck,
    badge: 'Cloud Certification',
    period: 'AWS Certified',
    title: 'AWS Certified Developer — Associate',
    location: 'Amazon Web Services',
    desc: 'Demonstrated proficiency in developing, deploying, optimizing, and debugging cloud-native applications using core AWS serverless and infrastructure services.',
    skills: ['AWS Lambda', 'DynamoDB', 'S3', 'API Gateway', 'CloudFormation'],
  },
  {
    icon: GraduationCap,
    badge: 'Education',
    period: '2019 — 2023',
    title: 'B.Tech, Computer Science & Engineering',
    location: 'SRKR Engineering College · Bhimavaram',
    desc: 'Graduated with core foundations in Data Structures, Algorithms, Distributed Computing and Web Technologies — where the obsession with side-projects began.',
    skills: ['Data Structures', 'Algorithms', 'DBMS', 'OS Concepts'],
  },
]

export default function JourneyTimeline() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 70%'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })

  return (
    <div ref={containerRef} className="journey-timeline-container">
      {/* SVG Background Track & Glowing Laser Path */}
      <div className="timeline-laser-track" aria-hidden="true">
        {/* Static Background Guide */}
        <div className="timeline-guide-line" />

        {/* Animated Glowing Laser Beam */}
        <motion.div
          className="timeline-laser-beam"
          style={{ scaleY, originY: 0 }}
        />
      </div>

      <div className="timeline-list">
        {MILESTONES.map((item, idx) => {
          const Icon = item.icon
          return (
            <Reveal key={item.title} delay={idx * 0.12}>
              <div className="tl-row">
                {/* Milestone Glowing Node */}
                <div className="tl-node">
                  <div className="tl-dot-ring">
                    <Icon size={16} className="tl-icon" />
                  </div>
                </div>

                {/* Milestone Content Card */}
                <div className="tl-content-wrap">
                  <SpotlightCard className="tl-card" tilt={false} spotlightRadius={300}>
                    <div className="tl-card-header">
                      <span className="tl-badge mono">{item.badge}</span>
                      <span className="tl-when mono">{item.period}</span>
                    </div>
                    <h3 className="tl-title">{item.title}</h3>
                    <p className="tl-loc">{item.location}</p>
                    <p className="tl-desc">{item.desc}</p>
                    <div className="tl-tags">
                      {item.skills.map((s) => (
                        <span key={s} className="tl-tag mono">{s}</span>
                      ))}
                    </div>
                  </SpotlightCard>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
