// textarea.type.ts
import type { Updater } from '@tanstack/react-form'
import type { TStyle } from '@wowjob/css'
import type { TextareaHTMLAttributes } from 'react'

export type TMarkdown = {
  name: string
  // ref?: Ref<HTMLTextAreaElement | null>
  type: 'markdown'
  label?: string
  help?: string
  handleChange: (updater: Updater<any>) => void
} & TStyle &
  TextareaHTMLAttributes<HTMLTextAreaElement>
