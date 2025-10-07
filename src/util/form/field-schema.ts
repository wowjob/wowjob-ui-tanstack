import { z } from 'zod'
import type { TValidation } from './form.type'

export const generateFieldSchema = (validation: TValidation): z.ZodTypeAny => {
  // String validation
  if (validation.string) {
    const v = validation.string
    let schema = z.string() // Use z.ZodType<string>

    // Apply transforms first
    if (v.trim) schema = schema.trim()
    if (v.toLowerCase) schema = schema.toLowerCase()
    if (v.toUpperCase) schema = schema.toUpperCase()

    // Apply validations
    if (v.min) schema = schema.min(v.min.value, { message: v.min.message })
    if (v.max) schema = schema.max(v.max.value, { message: v.max.message })
    if (v.length)
      schema = schema.length(v.length.value, { message: v.length.message })
    if (v.email) schema = schema.email({ message: v.email.message })
    if (v.url) schema = schema.url({ message: v.url.message })
    if (v.uuid) schema = schema.uuid({ message: v.uuid.message })
    if (v.regex)
      schema = schema.regex(v.regex.value, { message: v.regex.message })
    if (v.startsWith)
      schema = schema.startsWith(v.startsWith.value, {
        message: v.startsWith.message,
      })
    if (v.endsWith)
      schema = schema.endsWith(v.endsWith.value, {
        message: v.endsWith.message,
      })
    if (v.datetime) schema = schema.datetime({ message: v.datetime.message })
    if (v.ip) schema = schema.ip({ message: v.ip.message })

    // Handle validations not directly supported by Zod with refine
    if (v.includes)
      schema = schema.includes(v.includes.value, {
        message: v.includes.message,
      })

    if (v.date) schema = schema.date(v.date.message)

    if (v.time) schema = schema.time({ message: v.time.message })

    // Apply custom refinement
    if (v.refine) {
      return schema.refine(v.refine.value, { message: v.refine.message })
    }

    return schema
  }

  // Number validation (similar adjustment)
  if (validation.number) {
    const v = validation.number
    let schema = z.coerce.number() // Use z.ZodType<number>

    if (v.gt) schema = schema.gt(v.gt.value, { message: v.gt.message })
    if (v.gte) schema = schema.gte(v.gte.value, { message: v.gte.message })
    if (v.lt) schema = schema.lt(v.lt.value, { message: v.lt.message })
    if (v.lte) schema = schema.lte(v.lte.value, { message: v.lte.message })
    if (v.min) schema = schema.min(v.min.value, { message: v.min.message })
    if (v.max) schema = schema.max(v.max.value, { message: v.max.message })
    if (v.int) schema = schema.int({ message: v.int.message })
    if (v.positive) schema = schema.positive({ message: v.positive.message })
    if (v.nonnegative)
      schema = schema.nonnegative({ message: v.nonnegative.message })
    if (v.negative) schema = schema.negative({ message: v.negative.message })
    if (v.nonpositive)
      schema = schema.nonpositive({ message: v.nonpositive.message })
    if (v.multipleOf)
      schema = schema.multipleOf(v.multipleOf.value, {
        message: v.multipleOf.message,
      })
    if (v.finite) schema = schema.finite({ message: v.finite.message })
    if (v.safe) schema = schema.safe({ message: v.safe.message })

    if (v.refine) {
      return schema.refine(v.refine.value, { message: v.refine.message })
    }

    return schema
  }

  // Boolean validation (no refine, so no change needed)
  if (validation.boolean) {
    const schema: z.ZodType<boolean> = z.boolean()
    return schema
  }

  throw new Error('No validation type specified in TValidation')
}
