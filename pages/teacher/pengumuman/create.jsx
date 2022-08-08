import Head from 'next/head'
import Link from 'next/link'

import React, { useState, useRef } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapTemplate, MenuBarStyles, MenuButtons, EditorConfig, EditorContentStyles } from '../../../components/tiptap/tiptap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

export default function CreateAnnouncement() {
  EditorConfig['autofocus'] = true
  const editor = useEditor(EditorConfig)

  // Setting document title state
  const [title, setTitle] = useState('Untitled')
  const titleInput = useRef(null)
  titleInput.current?.addEventListener('focusout', () => {
    if (titleInput.current.value === '') setTitle('Untitled')
  })

  // Setting form data on submit
  const formRef = useRef(null)
  const contentInput = useRef(null)
  const createDateInput = useRef(null)

  // Handling form submit
  const handleSubmit = () => {
    contentInput.current.value = editor.getHTML()
    createDateInput.current.value = new Date()
    formRef.current.submit()
  }
  return (
    <main className="max-h-[100vh] flex-auto flex flex-col items-center justify-start p-4">
      <Head>
        <title>115 | Buat Pengumuman</title>
      </Head>
      <Link href="/teacher/dashboard">
        <FontAwesomeIcon icon={faHouse} className="absolute top-0 left-0 pt-3 pl-3 pb-6 pr-6 text-3xl rounded-br-full text-white bg-slate-800 hover:bg-slate-900 drop-shadow-lg cursor-pointer" />
      </Link>
      <form ref={formRef} action="/api/pengumuman/create" method="post" onSubmit={(e) => e.preventDefault()} className="will-change-auto flex-auto w-full flex overflow-y-auto">
        <TiptapTemplate>
          <div className="flex flex-col w-full bg-slate-100">
            <input
              ref={titleInput} type="text" name="title" 
              onChange={() => setTitle(titleInput.current.value)} value={title} autoComplete="off" 
              className="bg-inherit h-full outline-none border-2 border-transparent focus:border-slate-200 mx-2 mt-2 py-2 text-center text-3xl italic"
            />
            <div className={`${MenuBarStyles} items-center content-center`}>
              <MenuButtons editor={editor}>
                <button onClick={handleSubmit} className="px-4 py-2 text-lg font-semibold bg-green-600 hover:bg-green-500 text-white rounded-md">
                  Buat
                </button>
              </MenuButtons>
            </div>
          </div>
          <EditorContentStyles />
          <EditorContent autoFocus editor={editor} className="overflow-y-auto" />
          <input ref={createDateInput} type="hidden" name="createDate" value="" />
          <input ref={contentInput} type="hidden" name="content" value="" />
        </TiptapTemplate>
      </form>
    </main>
  )
}
