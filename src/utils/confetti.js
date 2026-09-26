// High-performance 60fps Canvas Confetti Engine (Zero external dependencies)
export function triggerConfetti(options = {}) {
  const {
    particleCount = 100,
    spread = 70,
    origin = { x: 0.5, y: 0.6 },
    colors = ['#7c83fd', '#00ff88', '#56ccf2', '#ff7b54', '#b47cff', '#ffb347', '#ff5f56'],
    shapes = ['square', 'circle', 'star'],
    duration = 3000,
  } = options

  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '999999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  let width = (canvas.width = window.innerWidth * window.devicePixelRatio)
  let height = (canvas.height = window.innerHeight * window.devicePixelRatio)
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  const particles = []
  const startX = origin.x * window.innerWidth
  const startY = origin.y * window.innerHeight

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * spread - spread / 2 - 90) * (Math.PI / 180)
    const velocity = 8 + Math.random() * 16
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.05 + Math.random() * 0.1,
      gravity: 0.35 + Math.random() * 0.2,
      drag: 0.985,
      opacity: 1,
    })
  }

  const startTime = performance.now()

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  let animId
  function render(time) {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    let aliveCount = 0
    for (const p of particles) {
      p.vx *= p.drag
      p.vy *= p.drag
      p.vy += p.gravity
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotationSpeed
      p.wobble += p.wobbleSpeed

      if (progress > 0.6) {
        p.opacity = Math.max(0, 1 - (progress - 0.6) / 0.4)
      }

      if (p.opacity > 0 && p.y < window.innerHeight + 50) {
        aliveCount++
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)

        const wobbleScale = Math.cos(p.wobble)

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2, p.color)
        } else {
          // Ribbon / rectangle
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, (-p.size * wobbleScale) / 2, p.size, p.size * wobbleScale)
        }
        ctx.restore()
      }
    }

    if (progress < 1 && aliveCount > 0) {
      animId = requestAnimationFrame(render)
    } else {
      cancelAnimationFrame(animId)
      if (canvas.parentNode) {
        document.body.removeChild(canvas)
      }
    }
  }

  animId = requestAnimationFrame(render)
}

// Full grand celebration cannon (multi-burst from left and right)
export function fireGrandConfetti() {
  triggerConfetti({
    particleCount: 80,
    spread: 60,
    origin: { x: 0.15, y: 0.7 },
  })

  triggerConfetti({
    particleCount: 80,
    spread: 60,
    origin: { x: 0.85, y: 0.7 },
  })

  setTimeout(() => {
    triggerConfetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['star', 'circle', 'square'],
    })
  }, 250)
}
