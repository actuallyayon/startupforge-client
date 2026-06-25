'use client';

import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, animate } from 'framer-motion'

/**
 * Animates a number from 0 up to `to` once it scrolls into view.
 * Formats with locale thousands separators + fixed decimals, and an
 * optional prefix/suffix (e.g. "850+", "10k+", "3.2k").
 * Honours prefers-reduced-motion by snapping straight to the final value.
 */
export default function CountUp({
  to,
  decimals = 0,
  duration = 1.6,
  prefix = '',
  suffix = '',
  className,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = useState(() => formatValue(0, decimals))

  useEffect(() => {
    if (!inView) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setDisplay(formatValue(to, decimals))
      return
    }

    const controls = animate(motionValue, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(formatValue(v, decimals)),
    })
    return () => controls.stop()
  }, [inView, to, decimals, duration, motionValue])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

function formatValue(value, decimals) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
