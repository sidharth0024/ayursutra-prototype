 import React from 'react'
 import { cn } from '@/lib/utils'
 interface ButtonProps extends React.ButtonHTMLAttributes&lt;HTMLButtonElement&gt; {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
 }
 export const Button = React.forwardRef&lt;HTMLButtonElement, ButtonProps&gt;(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) =&gt; {
    return (
      &lt;button
    className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colo
          {
            'bg-green-600 text-white hover:bg-green-700': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
            'border border-gray-300 bg-transparent hover:bg-gray-100': variant === 'outli
            'hover:bg-gray-100 text-gray-900': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 py-2 px-4': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      /&gt;
    )
  }
 )
 Button.displayName = 'Button'
