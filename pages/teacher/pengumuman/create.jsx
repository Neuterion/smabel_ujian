import Head from 'next/head'
import { useRouter } from 'next/router'

import React, { useState, useRef } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapTemplate, MenuBarStyles, MenuButtons, EditorConfig, EditorContentStyles } from '../../../components/tiptap/tiptap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight, faUserGraduate } from '@fortawesome/free-solid-svg-icons'

export default function CreateAnnouncement() {
  const router = useRouter()

  EditorConfig['autofocus'] = true
  EditorConfig['content'] = ''
  const editor = useEditor(EditorConfig)

  // Setting document title state
  const [title, setTitle] = useState('Untitled')
  const titleInput = useRef(null)
  titleInput.current?.addEventListener('focusout', () => {
    if (titleInput.current.value === '') setTitle('Untitled')
  })

  // Audience grade form
  const audienceGradeForm = useRef()
  const grade7 = useRef()
  const grade8 = useRef()
  const grade9 = useRef()
  const [audienceGradeFormHidden, setAudienceGradeFormHidden] = useState(true)

  // Handling form submit
  const handleSubmit = async () => {
    let audienceGrade = ''
    if (grade7.current.checked) audienceGrade += '7'
    if (grade8.current.checked) audienceGrade += '8'
    if (grade9.current.checked) audienceGrade += '9'
    
    if (audienceGrade === '') {
      setAudienceGradeFormHidden(false)
      return null
    }
    
    const res = await fetch('/api/pengumuman/create', {
      method: 'POST',
      body: JSON.stringify({
        title: titleInput.current.value,
        content: editor.getHTML(),
        createDate: Date.now(),
        audienceGrade: audienceGrade
      })
    })
    const { announcementId } = await res.json()
    if (res.ok) router.push(`/teacher/pengumuman/${announcementId}/edit`)
  }
  return (
    <main className="max-h-[100vh] flex-auto flex flex-col items-center justify-start p-4">
      <Head>
        <title>115 | Buat Pengumuman</title>
      </Head>
      <section className="will-change-auto flex-auto w-full flex overflow-y-auto">
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
          <EditorContent editor={editor} className="overflow-y-auto" />
        </TiptapTemplate>
      </section>
      <button onClick={() => setAudienceGradeFormHidden(false)} 
        className={`${audienceGradeFormHidden ? '' : 'hidden'} absolute right-0 top-1/2 -translate-y-1/2 flex items-center`}
      >
        <FontAwesomeIcon icon={faCaretLeft} className="text-5xl drop-shadow-lg text-slate-900" />
        <FontAwesomeIcon icon={faUserGraduate} size="2xl" className="p-4 mr-2 drop-shadow-lg rounded-full bg-slate-900 text-neutral-50" />
      </button>
      <section className={`${audienceGradeFormHidden ? 'hidden' : ''} absolute right-0 top-1/2 -translate-y-1/2 flex items-center mr-3`}>
        <button onClick={() => setAudienceGradeFormHidden(true)}>
          <FontAwesomeIcon icon={faCaretRight} className="text-5xl mr-2" />
        </button>
        <form ref={audienceGradeForm} className="flex flex-col bg-slate-900 text-neutral-50 font-inter p-3 rounded-lg">
          <h4 className="max-w-[20ch] font-semibold text-center">
            Kira-kira, pengumuman ini untuk kelas apa aja ya?
          </h4>
          <div className="flex gap-2">
            <input type="checkbox" id="kelas7" ref={grade7} value="7" />
            <label htmlFor="kelas7">Kelas 7</label>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="kelas8" ref={grade8} value="8" />
            <label htmlFor="kelas8">Kelas 8</label>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="kelas9" ref={grade9} value="9" />
            <label htmlFor="kelas9">Kelas 9</label>
          </div>
        </form>
      </section>
    </main>
  )
}
