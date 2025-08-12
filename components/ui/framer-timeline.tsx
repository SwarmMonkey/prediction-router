"use client"

import React, { useRef } from 'react'
import { useInView, motion, Variants, HTMLMotionProps } from 'framer-motion'

interface TimelineContentProps {
  as?: React.ElementType
  children: React.ReactNode
  timelineRef: React.RefObject<HTMLElement | null>
  animationNum: number
  variants: Variants
  className?: string
}

export function TimelineContent({
  as: Component = 'div',
  children,
  timelineRef,
  animationNum,
  variants,
  className,
  ...props
}: TimelineContentProps & Omit<HTMLMotionProps<"div">, keyof TimelineContentProps>) {
  const ref = useRef(null)
  const isInView = useInView(timelineRef, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      custom={animationNum}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      {...props}
    >
      <Component>{children}</Component>
    </motion.div>
  )
} 