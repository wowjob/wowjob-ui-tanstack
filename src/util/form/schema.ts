import type { TJSONForm } from '../../organism'
import { generateFieldSchema } from './field-schema'
import z from 'zod'

export const generateZodSchema = ({
  data,
  list,
}: TJSONForm['formStructure']) => {
  const schema: Record<string, z.ZodTypeAny> = {}

  // Filter and map fields with validation
  const validationList = list.filter(
    (fieldName) => data[fieldName]?.validation !== undefined,
  )

  for (const fieldName of Array.isArray(validationList) ? validationList : []) {
    if (data[fieldName]?.validation) {
      schema[fieldName] = generateFieldSchema(data[fieldName].validation)
    }
  }

  return z.object(schema)
}
