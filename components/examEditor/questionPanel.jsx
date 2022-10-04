import useSWR from 'swr'

import React from 'react'

import { EditorContent, useEditor } from '@tiptap/react'

import fetcher from '../../lib/fetcher'

import { EditorConfig_CustomContent } from '../tiptap'
import { ExamMenuButtons } from '../tiptap/exam'

const QuestionPanel = React.forwardRef((props, ref) => {
  const { data, error } = useSWR(`/api/question/${props.id}`, fetcher)

  let editor = null

  // Editor context
  React.useEffect(() => {
    const content = data.question ?? null
    editor = useEditor(EditorConfig_CustomContent(content))
  },
  [data])

  // Submitting data to parent component on save
  React.useImperativeHandle(ref, () => ({
    getData() {
      return {
        question: editor.getHTML()
      }
    }
  }))

  if (error) {
    return <div>Failed to load</div>
  }
  if (!data) {
    return <div>Loading...</div>
  }

  // Render data
  return (
    <>
      <nav className="flex justify-between -m-2 mb-1 p-2 bg-teal-700 text-slate-100">
        <div className="flex mx-1">
          <h3 className="my-auto text-lg font-semibold font-inter">
            Pertanyaan
          </h3>
        </div>
        <div className="flex">
          <ExamMenuButtons editor={editor} />
        </div>
      </nav>
      <ExamEditorContentStyles />
      <div className="-mx-1">
        <EditorContent editor={editor} />
      </div>
    </>
  )
})

const ExamEditorContentStyles = () => {
  return (
    <style global jsx>{`
      .ProseMirror {
        padding: 0.5rem;
        outline: none;
      }
      .ProseMirror > * + * {
        margin-top: 0.5rem;
      }
      .ProseMirror img {
        max-width: 100%;
        height: auto;
        pointer-events: auto;
        user-select: auto;
        margin: 0.5rem 0;
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }
    `}
    </style>
  )
}

export default QuestionPanel
