'use client'
// link.tsx
import { getStyle } from '@wowjob/css'
import { getEnv } from '@wowjob/ui'
import type { TTanstackLink } from './link.type'
import { Link } from '@tanstack/react-router'
import './link-block.css'

export const TanstackLink = ({
  mobile,
  tablet,
  desktop,
  theme,
  children,
  ...rest
}: TTanstackLink) => {
  const env = getEnv()

  const { className, style } = getStyle({
    mobile,
    tablet,
    desktop,
    env,
    theme,
  })

  rest.to = rest.href

  return (
    <Link viewTransition className={className} style={style} {...rest}>
      {children}
    </Link>
  )
}
