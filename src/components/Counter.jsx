import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

export default function Counter({
  from = 0,
  to = 0,
  duration = 1.8,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [displayValue, setDisplayValue] = useState(from.toFixed(decimals))

  useEffect(() => {
    if (!isInView) return

    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // snappy ease-out
      onUpdate: (latest) => {
        setDisplayValue(latest.toFixed(decimals))
      },
    })

    return () => controls.stop()
  }, [isInView, from, to, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
