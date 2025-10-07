import type { TStyle } from '@wowjob/css'

export type TActionFormReturn = {
  theme: TStyle['theme']
  status?: number
  title: string
  message: string[] | string
  code?: string
  redirect?: string
  data?: any
}
