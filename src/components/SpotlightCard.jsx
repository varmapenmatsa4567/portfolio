import { useRef, useState } from 'react'

/**
 * Modern Bento-style Spotlight Card with mouse-following radial border glow & ambient light.
 */
export default function SpotlightCard({
  children,
  className = '',
  tilt = true,
  spotlightRadius = 380,
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null)
  const [coords, setCoords] = useState({ x: -1000, y: -1000 })
  const [opacity, setOpacity] = useState(0)
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCoords({ x, y })
    setOpacity(1)

    if (tilt) {
      const px = x / rect.width
      const py = y / rect.height
      const rx = (0.5 - py) * 8
      const ry = (px - 0.5) * 10
      setTransform(`perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`)
    }
  }

  const handleMouseLeave = () => {
    setOpacity(0)
    if (tilt) {
      setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)')
    }
  }

  return (
    <Component
      ref={ref}
      className={`spotlight-card ${className}`}
      style={{ transform: tilt ? transform : undefined }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Dynamic Mouse-Following Radial Border Glow Layer */}
      <div
        className="spotlight-border"
        style={{
          opacity,
          background: `radial-gradient(${spotlightRadius}px circle at ${coords.x}px ${coords.y}px, var(--accent, #7c83fd) 0%, var(--accent-2, #56ccf2) 35%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Dynamic Mouse-Following Ambient Background Glow */}
      <div
        className="spotlight-ambient"
        style={{
          opacity: opacity * 0.85,
          background: `radial-gradient(${spotlightRadius + 60}px circle at ${coords.x}px ${coords.y}px, rgba(124, 131, 253, 0.1), transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Inner Card Content */}
      <div className="spotlight-inner">
        {children}
      </div>
    </Component>
  )
}
