import type { TInput, TTextarea } from '@wowjob/ui'

export type TStringValidation = {
  min?: { value: number; message: string }
  max?: { value: number; message: string }
  length?: { value: number; message: string }
  email?: { message: string }
  url?: { message: string }
  emoji?: { message: string }
  uuid?: { message: string }
  nanoid?: { message: string }
  cuid?: { message: string }
  cuid2?: { message: string }
  ulid?: { message: string }
  regex?: { value: RegExp; message: string }
  includes?: { value: string; message: string }
  startsWith?: { value: string; message: string }
  endsWith?: { value: string; message: string }
  datetime?: { message: string }
  ip?: { message: string }
  cidr?: { message: string }
  date?: { message: string }
  time?: { message: string }
  duration?: { message: string }
  base64?: { message: string }
  trim?: boolean
  toLowerCase?: boolean
  toUpperCase?: boolean
  refine?: {
    value: (val: string) => boolean | Promise<boolean>
    message: string
  }
}

export type TNumberValidation = {
  gt?: { value: number; message: string }
  gte?: { value: number; message: string }
  lt?: { value: number; message: string }
  lte?: { value: number; message: string }
  min?: { value: number; message: string }
  max?: { value: number; message: string }
  int?: { message: string }
  positive?: { message: string }
  nonnegative?: { message: string }
  negative?: { message: string }
  nonpositive?: { message: string }
  multipleOf?: { value: number; message: string }
  finite?: { message: string }
  safe?: { message: string }
  refine?: {
    value: (val: number) => boolean | Promise<boolean>
    message: string
  }
}

export type TBooleanValidation = {
  required?: { message: string }
}

export type TDateValidation = {
  min?: { value: Date; message: string }
  max?: { value: Date; message: string }
  refine?: {
    value: (val: Date) => boolean | Promise<boolean>
    message: string
  }
}

export type TValidation = {
  string?: TStringValidation
  number?: TNumberValidation
  boolean?: TBooleanValidation
}

export type TField = (TInput | TTextarea) & {
  validation?: TValidation
}
