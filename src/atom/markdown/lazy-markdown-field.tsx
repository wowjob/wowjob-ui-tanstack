import { lazy, Suspense } from 'react'
import type { TMarkdown } from './markdown.type'

// 1. Dynamically import the component that has the 'export default'
const MarkdownEditor = lazy(() => import('./markdown'))

// 2. Create a fallback component to show during load
const EditorSkeleton = () => (
  <div
    style={{
      height: '600px', // Match the editor height
      width: '100%',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    Loading Editor...
  </div>
)

// 3. Create the wrapper component that TanStack Form will use
// It accepts the same props as the real Markdown component
export const LazyMarkdownField = (props: TMarkdown) => {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <MarkdownEditor {...props} />
    </Suspense>
  )
}
