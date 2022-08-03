import Head from 'next/head'

import React, { useState, useRef } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapTemplate, MenuBarStyles, MenuButtons, EditorConfig, EditorContentStyles } from '../../../components/tiptap/tiptap'

export default function CreateAnnouncement() {
  EditorConfig['autofocus'] = true
  const editor = useEditor(EditorConfig)

  // Setting document title state
  const [title, setTitle] = useState('Untitled')
  const titleRef = useRef(null)
  titleRef.current?.addEventListener('focusout', () => {
    if (titleRef.current.value === '') setTitle('Untitled')
  })

  // Setting form data on submit
  const formRef = useRef(null)
  const contentRef = useRef(null)

  // Handling form submit
  const handleSubmit = () => {
    contentRef.current.value = editor.getHTML()
    formRef.current.submit()
  }
  return (
    <main className="max-h-[100vh] flex-auto flex flex-col items-center justify-start p-4">
      <Head>
        <title>115 | Buat Pengumuman</title>
      </Head>
      <form ref={formRef} action="/api/buat-pengumuman" method="post" className="flex-auto w-full flex overflow-y-auto">
        <TiptapTemplate>
          <div className="flex flex-col w-full bg-slate-100">
            <input
              ref={titleRef} type="text" name="title" 
              onChange={() => setTitle(titleRef.current.value)} value={title} autoComplete="off" 
              className="bg-inherit h-full outline-none border-2 border-transparent focus:border-slate-200 mx-2 mt-2 py-2 text-center text-3xl italic"
            />
            <div className={`${MenuBarStyles} items-center content-center`}>
              <MenuButtons editor={editor}>
                <button onClick={handleSubmit} className="px-4 py-2 text-lg font-bold bg-blue-500 hover:bg-blue-700 text-white rounded-md">
                  Simpan
                </button>
              </MenuButtons>
            </div>
          </div>
          <EditorContentStyles />
          <EditorContent autoFocus editor={editor} className="overflow-y-auto" />
          <input ref={contentRef} type="hidden" name="content" value="" />
        </TiptapTemplate>
      </form>
    </main>
  )
}
