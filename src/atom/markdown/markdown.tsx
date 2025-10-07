import type { TMarkdown } from './markdown.type'
import './markdown.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import { useRef } from 'react'
import { Flex, Text } from '@wowjob/ui'

const Markdown = ({
  mobile,
  tablet,
  desktop,
  theme,
  autoComplete = 'off',
  title,
  label,
  help,
  handleChange,
  ...rest
}: TMarkdown) => {
  const editorRef = useRef<Editor>(null)

  const doChange = () => {
    const instance = editorRef.current?.getInstance()
    const content = instance?.getMarkdown()
    handleChange(content)
  }

  return (
    <Flex>
      {label && (
        <Text
          mobile={{
            fontSize: 20,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        >
          {label}
        </Text>
      )}
      {help && <Text>{help}</Text>}

      <Flex theme="light" mobile={{ borderRadius: 8 }}>
        <Editor
          initialValue={rest.defaultValue || rest.value}
          previewStyle="vertical"
          height="600px"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          onChange={doChange}
          ref={editorRef}
          theme="light"
        />
      </Flex>
    </Flex>
  )
}

export default Markdown
