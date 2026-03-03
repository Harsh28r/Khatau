import { type HTMLAttributes } from 'react'
import clsx from 'classnames'

export default function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mx-auto w-full max-w-6xl px-4', className)} {...rest} />
}


