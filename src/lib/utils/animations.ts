import { Variants } from "framer-motion";

// Premium, smooth transitions similar to Apple, Stripe, Linear, etc.
export const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 1,
};

export const easeTransition = {
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // easeOutExpo / custom cubic-bezier
  duration: 0.55,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easeTransition },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: easeTransition },
  exit: { opacity: 0, y: 15, transition: { duration: 0.2 } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: easeTransition },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 15 },
  visible: { opacity: 1, x: 0, transition: easeTransition },
  exit: { opacity: 0, x: 15, transition: { duration: 0.2 } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: easeTransition },
  exit: { opacity: 0, x: -15, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: easeTransition },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.18 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: easeTransition },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

export const modalTransition: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springTransition },
  exit: { opacity: 0, scale: 0.96, y: 15, transition: { duration: 0.18 } },
};

export const sidebarTransition: Variants = {
  hidden: { x: -280, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: easeTransition },
  exit: { x: -280, opacity: 0, transition: { duration: 0.25 } },
};

export const backdropTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};
