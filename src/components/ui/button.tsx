"use client"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import React, { forwardRef } from "react"
import { Loader2 } from "lucide-react"

// Unified button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles - unified across all variants
  "inline-flex items-center justify-center gap-2 rounded-button font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-touch min-w-touch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-accent-primary",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-l from-primary to-primary-dark dark:from-accent-primary dark:to-accent-primary-dark text-white shadow-button hover:shadow-elevation-2",
        secondary: "border-2 border-primary text-primary bg-transparent hover:bg-primary/5 dark:border-border-subtle dark:text-text-primary dark:hover:bg-surface-elevated/50",
        outline: "border border-text-secondary text-text-primary hover:bg-cream-bg dark:border-border-subtle dark:text-text-primary dark:hover:bg-surface-muted",
        ghost: "text-text-primary hover:bg-cream-bg dark:text-text-primary dark:hover:bg-surface-muted",
        danger: "bg-danger-red text-white hover:bg-danger-red/90 dark:bg-red-900 dark:hover:bg-red-800",
        tertiary: "text-text-primary hover:bg-cream-bg dark:text-text-primary dark:hover:bg-surface-muted",
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
        disabled: "bg-primary/20 text-primary/40 border border-primary/30 cursor-not-allowed dark:bg-surface-muted dark:text-text-muted dark:border-border-subtle",
      },
      size: {
        default: "px-6 py-3 text-base",
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        icon: "p-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
  isLoading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, size, href, isLoading, asChild, ...props }, ref) => {
    const buttonContent = (
      <>
        {isLoading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </>
    )

    const buttonClasses = cn(buttonVariants({ variant, size, className }))

    const wrapperClass = cn('inline-block', className?.includes('w-full') && 'w-full')

    // If href is provided, render as Link
    if (href) {
      return (
        <motion.div 
          whileHover={!isLoading ? { scale: 1.02 } : {}} 
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className={wrapperClass}
        >
          <Link href={href} className={buttonClasses}>
            {buttonContent}
          </Link>
        </motion.div>
      )
    }

    // Render as button
    return (
      <motion.div 
        whileHover={!isLoading && !props.disabled ? { scale: 1.02 } : {}} 
        whileTap={!isLoading && !props.disabled ? { scale: 0.98 } : {}}
        className={wrapperClass}
      >
        <button ref={ref} className={buttonClasses} disabled={isLoading || props.disabled} {...props}>
          {buttonContent}
        </button>
      </motion.div>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
// ButtonProps is already exported as interface above
