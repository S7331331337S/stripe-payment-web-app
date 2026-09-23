'use client'

import { useEffect, useRef } from 'react'

type Point = {
  x: number
  y: number
  z: number
  screenX: number
  screenY: number
  depth: number
  scale: number
}

// Adapted from superfanz-evan-e9/components/landing/animated-sphere.tsx.
// Keep its spherical sampling and three-axis rotation, rendered as fine points.
export function HeroPointCloud() {
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
      const rotationZ = elapsed * 0.15
      const rotationY = elapsed * 0.22 + 0.4
      const rotationX = elapsed * 0.12 + 0.3
      const sinZ = Math.sin(rotationZ)
      const cosZ = Math.cos(rotationZ)
      const sinY = Math.sin(rotationY)
      const cosY = Math.cos(rotationY)
      const sinX = Math.sin(rotationX)
      const cosX = Math.cos(rotationX)

      for (const point of points) {
        const x = point.x * cosZ - point.y * sinZ
        const y = point.x * sinZ + point.y * cosZ
        const rotatedX = x * cosY - point.z * sinY
        const rotatedZ = x * sinY + point.z * cosY
        const rotatedY = y * cosX - rotatedZ * sinX
        const z = y * sinX + rotatedZ * cosX
        const perspective = 3 / (3 - z * 0.35)

        point.screenX = width / 2 + rotatedX * radius * perspective
        point.screenY = height / 2 + rotatedY * radius * perspective
        point.depth = (z + 1) / 2
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

      draw()
      syncAnimation()
    }

    const updateColor = () => {
      color = getComputedStyle(canvas).color
      draw()
    }

    const updateMotion = () => {
      // Reduced motion keeps a still sphere, including when changed mid-session.
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
  }, [])

  return (
    <div className="hero-point-cloud" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-point-cloud-canvas" />
    </div>
  )
}
