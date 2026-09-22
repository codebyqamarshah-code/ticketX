'use client';

import { motion } from 'framer-motion';

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  duration = 0.5,
  once = true,
  scale = false,
}) {
  const getVariants = () => {
    let initialX = 0;
    let initialY = 0;

    if (direction === 'up') initialY = 30;
    if (direction === 'down') initialY = -30;
    if (direction === 'left') initialX = 30;
    if (direction === 'right') initialX = -30;

    return {
      hidden: {
        opacity: 0,
        x: initialX,
        y: initialY,
        scale: scale ? 0.95 : 1,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    };
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStaggerContainer({
  children,
  className = '',
  staggerDelay = 0.08,
  delay = 0,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStaggerItem({
  children,
  className = '',
  direction = 'up',
}) {
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 24 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
