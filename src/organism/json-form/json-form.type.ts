// json-form.type.ts
import type { TActionFormReturn } from '../../type'
import type { TButton, TInput, TTextarea } from '@wowjob/ui'
import type { TValidation } from '../../util/form/form.type'
import type { MouseEvent, ReactNode } from 'react'

export type TField = (TInput | TTextarea) & {
  validation?: TValidation
  valueList?: {
    label?: string
    help?: string
    value?: string | number | readonly string[] | undefined
    defaultValue?: string | number | readonly string[] | undefined
    defaultChecked?: boolean | undefined
  }[]
}

export type TJSONFormStructure = {
  data: Record<string, TField>
  list: string[]
  form: {
    name: string
    header?: {
      title: string
      description?: string
    }
    footer: {
      data: Record<string, TButton>
      list: string[]
    }
  }
}

type TBackLink = {
  label: string
  title: string
  href: string
}

type TBackButton = {
  label: string
  title: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export type TJSONForm = {
  children?: ReactNode
  formStructure: TJSONFormStructure
  showActionButtonList?: boolean
  softSave?: (data: any) => void

  /** initial values keyed by field name */
  valueMap?: Record<
    string,
    readonly string[] | string | number | boolean | null
  >

  back?: TBackButton | TBackLink

  height?: string

  /**
   * submit now takes your generic `Data` shape,
   * and returns a Promise of your generic `Result` type
   */
  submit?: (data: any) => Promise<TActionFormReturn>
}
