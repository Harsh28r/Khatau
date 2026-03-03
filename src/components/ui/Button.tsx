import { type ButtonHTMLAttributes } from 'react'
import clsx from 'classnames'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ className, variant = 'primary', size = 'md', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3',
  }[size]
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    secondary: 'border border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    outline: 'border border-gray-400 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400',
  }[variant]
  return <button className={clsx(base, sizes, variants, className)} {...rest} />
}


