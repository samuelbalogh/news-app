'use client'

import { useEffect, useRef } from 'react'

export function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
        const latin = '0123456789'
        const chars = katakana + latin

        const fontSize = 16
        const columns = canvas.width / fontSize

        const drops: number[] = []
        const isActiveColumn: boolean[] = []
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.floor(Math.random() * canvas.height / fontSize)
            isActiveColumn[x] = Math.random() < 0.5
        }

        function draw() {
            ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

            ctx!.fillStyle = '#0F0'
            ctx!.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                if (!isActiveColumn[i]) continue

                const text = chars[Math.floor(Math.random() * chars.length)]
                ctx!.fillText(text, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
                    drops[i] = 0
                    isActiveColumn[i] = Math.random() < 0.5
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 33)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="matrix-rain">
            <canvas ref={canvasRef} />
        </div>
    )
} 