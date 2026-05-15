"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number; y: number; vx: number; vy: number
  r: number; phase: number; speed: number
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number
    let nodes: Node[] = []
    let mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }

    const init = () => {
      nodes = []
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 130)
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.018 + 0.008,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        // bounce
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        n.x += n.vx
        n.y += n.vy
        n.phase += n.speed

        // mouse repulsion
        const dx = n.x - mouse.x, dy = n.y - mouse.y
        const md = Math.sqrt(dx * dx + dy * dy)
        if (md < 90) {
          const force = (90 - md) / 90
          n.x += (dx / md) * force * 1.5
          n.y += (dy / md) * force * 1.5
        }

        const alpha = 0.45 + Math.sin(n.phase) * 0.2
        const r     = n.r  + Math.sin(n.phase) * 0.4

        // glow halo
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5)
        grad.addColorStop(0, `rgba(0,212,255,${alpha * 0.35})`)
        grad.addColorStop(1, "rgba(0,212,255,0)")
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,212,255,${alpha})`
        ctx.fill()

        // edges to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const q    = nodes[j]
          const ex   = n.x - q.x, ey = n.y - q.y
          const dist = Math.sqrt(ex * ex + ey * ey)
          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.14
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0,212,255,${opacity})`
            ctx.lineWidth   = 0.5
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    window.addEventListener("resize",     resize)
    window.addEventListener("mousemove",  onMouseMove,  { passive: true })
    window.addEventListener("mouseleave", onMouseLeave)

    resize()
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize",     resize)
      window.removeEventListener("mousemove",  onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  )
}
