// link.type.ts
import type { AnchorHTMLAttributes } from 'react'
import type { LinkProps } from '@tanstack/react-router'
import type { TStyle } from '@wowjob/css'

export type TTanstackLink = {
  title?: string
  href: string
  type?: '' | 'button' | 'block'
} & TStyle &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  Partial<LinkProps>
