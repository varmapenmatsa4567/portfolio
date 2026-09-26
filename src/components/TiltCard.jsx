import SpotlightCard from './SpotlightCard.jsx'

// Backwards-compatible 3D tilt card powered by SpotlightCard with mouse-following radial border glow.
export default function TiltCard({ children, className = '', ...props }) {
  return (
    <SpotlightCard className={`tilt-card ${className}`} tilt={true} {...props}>
      {children}
    </SpotlightCard>
  )
}
