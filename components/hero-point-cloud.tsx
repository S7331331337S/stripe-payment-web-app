'use client'

import { useEffect, useRef } from 'react'
import { createMolecularPoints, molecularBlend, type Vector3 } from '@/lib/molecular-point-cloud'

type Point = {
  x: number
  y: number
  z: number
  screenX: number
  screenY: number
  depth: number
  scale: number
  target?: Vector3
}

// Adapted from superfanz-evan-e9/components/landing/animated-sphere.tsx.
// Preserve the sphere preset and add illustrative molecular point-cloud studies.
export function HeroPointCloud({ shape = 'sphere' }: { shape?: 'sphere' | 'helix' | 'protein' | 'molecular' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let points: Point[] = []
    let width = 0
    let height = 0
    let color = getComputedStyle(canvas).color
    let visible = false
    let elapsed = 0
    let previousFrame = 0
    let previousPaint = 0
    let frame: number | null = null

    const draw = () => {
      context.clearRect(0, 0, width, height)
      if (!width || !height) return

      const radius = Math.min(width, height) * 0.43
      const molecular = shape !== 'sphere'
      const blend = shape === 'protein' ? 1 : shape === 'molecular' ? molecularBlend(elapsed) : 0
      const rotationZ = molecular ? -0.22 + Math.sin(elapsed * 0.13) * 0.12 : elapsed * 0.15
      const rotationY = elapsed * 0.22 + 0.4
      const rotationX = molecular ? Math.sin(elapsed * 0.17) * 0.2 : elapsed * 0.12 + 0.3
      const sinZ = Math.sin(rotationZ)
      const cosZ = Math.cos(rotationZ)
      const sinY = Math.sin(rotationY)
      const cosY = Math.cos(rotationY)
      const sinX = Math.sin(rotationX)
      const cosX = Math.cos(rotationX)

      for (const point of points) {
        const sourceX = point.x + ((point.target?.x ?? point.x) - point.x) * blend
        const sourceY = point.y + ((point.target?.y ?? point.y) - point.y) * blend
        const sourceZ = point.z + ((point.target?.z ?? point.z) - point.z) * blend
        const x = sourceX * cosZ - sourceY * sinZ
        const y = sourceX * sinZ + sourceY * cosZ
        const rotatedX = x * cosY - sourceZ * sinY
        const rotatedZ = x * sinY + sourceZ * cosY
        const rotatedY = y * cosX - rotatedZ * sinX
        const z = y * sinX + rotatedZ * cosX
        const perspective = 3 / (3 - z * 0.35)

        point.screenX = width / 2 + rotatedX * radius * perspective
        point.screenY = height / 2 + rotatedY * radius * perspective
        point.depth = Math.max(0, Math.min(1, (z + 1) / 2))
        point.scale = perspective
      }

      points.sort((a, b) => a.depth - b.depth)
      context.fillStyle = color

      for (const point of points) {
        context.globalAlpha = 0.16 + point.depth * 0.74
        context.beginPath()
        context.arc(
          point.screenX,
          point.screenY,
          (0.65 + point.depth * 0.9) * point.scale,
          0,
          Math.PI * 2,
        )
        context.fill()
      }

      context.globalAlpha = 1
    }

    const animate = (timestamp: number) => {
      if (previousFrame) elapsed += Math.min(timestamp - previousFrame, 64) / 1000
      previousFrame = timestamp

      // Limit painting to 30fps, independent of the display's refresh rate.
      if (timestamp - previousPaint >= 1000 / 30 - 1) {
        draw()
        previousPaint = timestamp
      }

      frame = requestAnimationFrame(animate)
    }

    const syncAnimation = () => {
      const shouldAnimate = visible && !document.hidden && !motionPreference.matches && width > 0 && height > 0
      if (shouldAnimate && frame === null) {
        previousFrame = 0
        previousPaint = 0
        frame = requestAnimationFrame(animate)
      } else if (!shouldAnimate && frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Sample once per resize; smaller canvases need fewer points.
      points = []
      if (shape !== 'sphere') {
        points = createMolecularPoints(width < 480).map(({ helix, protein }) => ({
          ...helix,
          target: protein,
          screenX: 0,
          screenY: 0,
          depth: 0,
          scale: 1,
        }))
      } else {
        const step = width < 480 ? 0.19 : 0.15
        for (let phi = 0; phi < Math.PI * 2; phi += step) {
          for (let theta = step / 2; theta < Math.PI; theta += step) {
            points.push({
              x: Math.sin(theta) * Math.cos(phi),
              y: Math.sin(theta) * Math.sin(phi),
              z: Math.cos(theta),
              screenX: 0,
              screenY: 0,
              depth: 0,
              scale: 1,
            })
          }
        }
      }

      draw()
      syncAnimation()
    }

    const updateColor = () => {
      color = getComputedStyle(canvas).color
      draw()
    }

    const updateMotion = () => {
      // Reduced motion freezes both rotation and morphing, including live changes.
      draw()
      syncAnimation()
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncAnimation()
    })
    const themeObserver = new MutationObserver(updateColor)

    resize()
    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', syncAnimation)
    motionPreference.addEventListener('change', updateMotion)

    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', syncAnimation)
      motionPreference.removeEventListener('change', updateMotion)
    }
  }, [shape])

  return (
    <div className="hero-point-cloud" data-shape={shape} aria-hidden="true">
      <canvas ref={canvasRef} className="hero-point-cloud-canvas" />
    </div>
  )
}
