import type { ButtonHTMLAttributes } from 'react'

export function Button({ variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  return <button className={`button button-${variant}`} {...props} />
}
