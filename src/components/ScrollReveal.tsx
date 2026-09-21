'use client'

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const hiddenTransform = {
    up: 'translate-y-10 scale-[0.98]',
    left: '-translate-x-10 scale-[0.98]',
    right: 'translate-x-10 scale-[0.98]',
    scale: 'scale-[0.92]',
  }[direction]

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={[
        'transition-[opacity,transform,filter]',
        'duration-[750ms]',
        'ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0'
          : `${hiddenTransform} opacity-0 blur-[5px]`,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}