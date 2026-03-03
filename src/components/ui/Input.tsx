import { type InputHTMLAttributes } from 'react'
import clsx from 'classnames'

type Props = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...rest }: Props) {
  return (
    <input
      className={clsx('w-full rounded border border-gray-300 bg-white p-2 text-sm outline-none ring-red-600/20 transition focus:ring-2', className)}
      {...rest}
    />
  )
}


