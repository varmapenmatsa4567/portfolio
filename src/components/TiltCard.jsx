import { useRef, useState } from 'react'

// 3D tilt-on-hover card with a moving glare highlight.
export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})
  const [glare, setGlare] = useState({ opacity: 0 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * 10
    const ry = (px - 0.5) * 12
    setStyle({ transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)` })
    setGlare({
      opacity: 1,
      background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.12), transparent 45%)`,
    })
  }
  const onLeave = () => {
    setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' })
    setGlare({ opacity: 0 })
  }

  return (
    <div ref={ref} className={`tilt-card ${className}`} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="tilt-glare" style={glare} />
      {children}
    </div>
  )
}
