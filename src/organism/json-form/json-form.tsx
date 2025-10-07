import { lazy, Suspense } from 'react'

import {
  Button,
  Flex,
  Text,
  InputField,
  TextareaField,
  PasswordField,
} from '@wowjob/ui'
import type { TJSONForm, TJSONFormStructure } from './json-form.type'
import { generateZodSchema } from '../../util'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import type { TInput, TTextarea } from '@wowjob/ui'
import type { TActionFormReturn } from '../../type'
import {
  HTMLInputTypeAttribute,
  useEffect,
  useState,
  type ChangeEvent,
} from 'react'
import './json-form.css'
import type { ZodIssue } from 'zod'
import { deepClone } from '@wowjob/util'
// import { Markdown, TanstackLink, TMarkdown } from '../../atom'
import { TanstackLink } from '../../atom'
import type { TMarkdown } from '../../atom/markdown/markdown.type'
import { LazyMarkdownField } from '../../atom/markdown/lazy-markdown-field'

const getValueMap = ({ list, data }: TJSONFormStructure) => {
  const map: NonNullable<TJSONForm['valueMap']> = {}

  for (const key of list) {
    if (
      data[key]?.type === 'checkbox' &&
      !(data[key]?.defaultValue || data[key]?.value)
    ) {
      map[key] = false
    } else {
      map[key] = data[key]?.defaultValue || data[key]?.value || ''
    }
  }

  return map
}

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    TextareaField,
    PasswordField,
    Markdown: LazyMarkdownField,
  },
  formComponents: {
    Button,
  },
})

export const JSONForm = ({
  children,
  formStructure,
  valueMap,
  back,
  height,
  submit,
  showActionButtonList,
  softSave,
}: TJSONForm) => {
  const fs = deepClone(formStructure)
  const { list } = fs

  for (const key of list) {
    if (valueMap && valueMap[key]) {
      if (
        ['checkbox', 'radio'].includes(
          fs.data[key].type as HTMLInputTypeAttribute,
        )
      ) {
        fs.data[key].defaultChecked = !!valueMap[key] || false
      } else {
        fs.data[key].defaultValue = String(valueMap[key]) || ''
      }
    }
  }

  const schema = generateZodSchema(fs)
  const defaultValues = getValueMap(fs)
  const [header, setHeader] = useState<TActionFormReturn>()

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: ({ value: valueMap }) => {
        const result = schema.safeParse(valueMap)

        if (result.success) {
          if (typeof softSave === 'function') {
            softSave(valueMap)
          }

          return
        }

        const errorFields: Record<string, ZodIssue[]> = {}

        for (const issue of result.error.issues) {
          const key = String(issue.path[0] || '_form')
          if (!errorFields[key]) {
            errorFields[key] = []
          }
          errorFields[key]!.push(issue)
        }

        return {
          fields: errorFields,
        }
      },
    },
    onSubmit: async ({ value, formApi }) => {
      if (typeof submit === 'function') {
        const result = await submit(value)

        if ('message' in result && result?.message) {
          setHeader(result)
        }

        if (result?.redirect) {
          // setTimeout(() => {
          //   router.push(result?.redirect || '/')
          // }, 2000)
        }

        const emptyValueMap = list.reduce(
          (acc, key) => {
            acc[key] = fs.data[key].type === 'checkbox' ? false : ''
            return acc
          },
          {} as Record<
            string,
            string | number | boolean | readonly string[] | null
          >,
        )

        form.reset(emptyValueMap)
      }
    },
  })

  useEffect(() => {
    form.reset(valueMap)
  }, [valueMap])

  const { footer } = fs.form

  const messageList = Array.isArray(header?.message)
    ? header.message
    : [header?.message]

  return (
    <form.AppForm>
      <Flex>
        <Flex
          as="form"
          onSubmit={(e) => {
            e.stopPropagation()
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <Flex
            mobile={{
              gap: 16,
              flexDirection: 'column',
              maxHeight: 'calc(100dvh - 7rem)',
              // width: 'fit-content',
            }}
          >
            {(list.length > 0 || fs?.form?.header?.description) && (
              <Flex mobile={{ overflow: 'auto', padding: 1 }}>
                {fs?.form?.header?.description && (
                  <Text>{fs.form.header.description}</Text>
                )}

                <Flex>
                  {list.map((inputName) => (
                    <form.AppField
                      key={inputName}
                      name={inputName}
                      // biome-ignore lint: lint/correctness/noChildrenProp
                      children={(field) => {
                        const fieldData = fs.data[inputName]
                        const { isDirty, isBlurred, isPristine } =
                          field.state.meta
                        const errorList = (field.state.meta.errors ||
                          []) as ZodIssue[]

                        if (fieldData.type === 'textarea') {
                          return (
                            <field.TextareaField
                              {...(fieldData as TTextarea)}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                field.handleChange(
                                  (e.target as HTMLTextAreaElement).value,
                                )
                              }
                              onBlur={field.handleBlur}
                              errorList={isDirty && isBlurred ? errorList : []}
                            />
                          )
                        }

                        if (fieldData.type === 'markdown') {
                          return (
                            <field.Markdown
                              {...(fieldData as TMarkdown)}
                              handleChange={field.handleChange}
                            />
                          )
                        }

                        if (fieldData.type === 'password') {
                          return (
                            <field.PasswordField
                              {...(fieldData as TInput)}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                field.handleChange(
                                  (e.target as HTMLInputElement).value,
                                )
                              }
                              onBlur={field.handleBlur}
                              errorList={isDirty && isBlurred ? errorList : []}
                            />
                          )
                        }

                        return (
                          <field.InputField
                            {...(fieldData as TInput)}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              // fieldData.value = e.target.value
                              // field['fieldLength'] = e.target.value.length
                              fieldData.fieldLength = e.target.value.length

                              field.handleChange(
                                fieldData.type === 'checkbox'
                                  ? (e.target as HTMLInputElement).checked
                                  : (e.target as HTMLInputElement).value,
                              )
                            }}
                            onBlur={field.handleBlur}
                            errorList={isDirty && isBlurred ? errorList : []}
                          />
                        )
                      }}
                    />
                  ))}
                </Flex>

                {children && <Flex>{children}</Flex>}
              </Flex>
            )}

            <Flex
              mobile={{
                flexShrink: 0,
                flexDirection: 'row',
                overflow: 'hidden',
              }}
            >
              <form.Subscribe
                selector={(state) => [
                  state.isValid,
                  state.isDirty,
                  state.isSubmitting,
                ]}
                // biome-ignore lint: lint/correctness/noChildrenProp
                children={([isValid, isDirty, isSubmitting]) => {
                  return footer.list.map((inputName) => (
                    <Flex
                      key={inputName}
                      mobile={{
                        opacity:
                          showActionButtonList ||
                          typeof softSave === 'function' ||
                          isDirty ||
                          list.length === 0
                            ? 1
                            : 0,
                        transform:
                          showActionButtonList ||
                          typeof softSave === 'function' ||
                          isDirty ||
                          list.length === 0
                            ? 'translateY(0rem)'
                            : 'translateY(10rem)',
                        transition: '250ms',
                      }}
                    >
                      <form.Button
                        theme={footer.data[inputName]?.theme}
                        type={footer.data[inputName]?.type}
                        aria-disabled={
                          showActionButtonList ||
                          typeof softSave === 'function' ||
                          list.length === 0
                            ? false
                            : !(isValid && isDirty)
                        }
                        disabled={
                          showActionButtonList ||
                          typeof softSave === 'function' ||
                          list.length === 0
                            ? false
                            : !(isValid && isDirty)
                        }
                        onClick={
                          footer.data[inputName]?.type === 'reset'
                            ? () => form.reset()
                            : () => {}
                        }
                      >
                        {footer.data[inputName]?.label}
                        {isSubmitting ? ' ...' : ''}{' '}
                      </form.Button>
                    </Flex>
                  ))
                }}
              />
            </Flex>
          </Flex>
        </Flex>

        {fs.form.header?.title && (
          <Flex mobile={{ order: -1 }}>
            {fs.form.header?.title && (
              <Flex mobile={{ gap: 0 }}>
                <Flex
                  mobile={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    as="h3"
                    mobile={{
                      fontSize: 24,
                      whiteSpace: 'nowrap',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}
                    title={fs.form.header.title}
                  >
                    {fs.form.header.title}
                  </Text>

                  {back && 'onClick' in back && (
                    <Button
                      theme="muted"
                      onClick={back.onClick}
                      title={back.title}
                      type="button"
                      mobile={{ flexShrink: 0 }}
                    >
                      {back.label}
                    </Button>
                  )}

                  {back && 'href' in back && (
                    <TanstackLink
                      theme="warning"
                      href={back.href}
                      title={back.title}
                    >
                      {back.label}
                    </TanstackLink>
                  )}
                </Flex>
              </Flex>
            )}

            {header?.title && (
              <Flex
                mobile={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  alignSelf: 'center',
                  gap: 0,
                }}
                theme={header.theme}
              >
                <Text
                  as="h3"
                  mobile={{ padding: [8, 16] }}
                  theme={header.theme}
                >
                  {header.title}!!
                </Text>

                <Flex
                  mobile={{ padding: [8, 16], borderRadius: 8 }}
                  theme={header.theme}
                >
                  {messageList.map((message, index) => (
                    <Text key={index}>{message}</Text>
                  ))}
                </Flex>
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </form.AppForm>
  )
}
