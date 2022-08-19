import { prisma } from '../../../../lib/prisma'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Head from 'next/head'

import React, { useState, useRef } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapTemplate, MenuBarStyles, MenuButtons, EditorConfig, EditorContentStyles } from '../../../../components/tiptap/tiptap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight, faUserGraduate } from '@fortawesome/free-solid-svg-icons'

export default function EditAnnouncement({ announcement }) {
  // Setting form data on edit
  const [title, setTitle] = useState(announcement.title)
  const titleInput = useRef()
  titleInput.current?.addEventListener('focusout', () => {
    if (titleInput.current.value === '') setTitle(announcement.title)
  })

  // Audience grade form
  const audienceGradeForm = useRef()
  const audienceGrades = {}
  for (const char of announcement.audienceGrade.split('')) {
    audienceGrades[char] = true
  }
  const grade7 = useRef()
  const grade8 = useRef()
  const grade9 = useRef()
  // Audience grade checkbox form state
  let [audienceGradeFormFirstTimeOpened, setAudienceGradeFormFirstTimeOpened] = useState(true)
  const [audienceGradeFormHidden, setAudienceGradeFormHidden] = useState(true)

  // Edit button ref
  const editButton = useRef()
  // Handling form edit
  const handleEdit = async () => {
    // Check for changes
    let newAudienceGrade = ''
    if (grade7.current.checked) newAudienceGrade += '7'
    if (grade8.current.checked) newAudienceGrade += '8'
    if (grade9.current.checked) newAudienceGrade += '9'

    if (titleInput.current.value !== announcement.title || editor.getHTML() !== announcement.content || announcement.audienceGrade !== newAudienceGrade) {
      editButton.current.textContent = '...'
      const res = await fetch('/api/pengumuman/edit', {
        method: 'POST',
        body: JSON.stringify({
          id: announcement.id,
          title: titleInput.current.value,
          content: editor.getHTML(),
          editDate: Date.now(),
          audienceGrade: newAudienceGrade
        })
      })
      if (res.ok) {
        editButton.current.onClick = null
        editButton.current.textContent = "✅"
        const { updatedContent, updatedAudienceGrade } = await res.json()
        announcement.content = updatedContent
        announcement.audienceGrade = updatedAudienceGrade
        setAudienceGradeFormFirstTimeOpened(true)
        setTimeout(() => {
          editButton.current.textContent = "Simpan"
          editButton.current.onClick = handleEdit
        }, 1000)
      }
    }      
  }

  // Delete confirmation form state
  const [deleteConfirmationHidden, setDeleteConfirmationHidden] = useState(true)

  // Handling form deletion
  const handleDelete = async () => {
    const res = await fetch('/api/pengumuman/delete', {
      method: 'POST',
      body: JSON.stringify({
        id: announcement.id
      })
    })
    if (res.ok) router.push('/teacher/dashboard')
  }


  EditorConfig['content'] = announcement.content
  const editor = useEditor(EditorConfig)
  
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === 'authenticated') {
    if (announcement.userId !== session.id) router.push(`/pengumuman/${announcement.id}`)
    return (
      <main className="max-h-[100vh] flex-auto flex flex-col items-center justify-start p-4 bg-white">
        <Head>
          <title>115 | Buat Pengumuman</title>
        </Head>
        <form action="/api/pengumuman/edit" method="post" onSubmit={(e) => e.preventDefault()} className="will-change-auto flex-auto w-full flex overflow-y-auto">
          <TiptapTemplate>
            <div className="flex flex-col w-full bg-slate-100">
              <input
                ref={titleInput} type="text" name="title" 
                onChange={() => setTitle(titleInput.current.value)} value={title} autoComplete="off" 
                className="bg-inherit h-full outline-none border-2 border-transparent focus:border-slate-200 mx-2 mt-2 py-2 text-center text-3xl italic"
              />
              <div className={`${MenuBarStyles} items-center content-center`}>
                <MenuButtons editor={editor}>
                  <button ref={editButton} onClick={handleEdit} className="px-4 py-2 text-lg font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded-md">
                    Simpan
                  </button>
                  <button onClick={() => setDeleteConfirmationHidden(false)} className="px-4 py-2 text-lg font-normal border border-red-500 hover:bg-red-500 text-red-500 hover:text-white rounded-md">
                    Hapus
                  </button>
                </MenuButtons>
              </div>
              <div id="deleteConfirmationWrapper" className={`absolute inset-0 bg-black/50 flex justify-center items-center z-50 ${deleteConfirmationHidden ? "hidden" : ""}`}>
                <div id="deleteConfirmation" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg font-inter transition-opacity duration-150">
                  <h1 className="text-2xl font-semibold">
                    Apakah Anda yakin ingin menghapus pengumuman ini?
                  </h1>
                  <div className="flex justify-center w-full gap-14 mt-2">
                    <button onClick={() => setDeleteConfirmationHidden(true)} className="flex-auto px-4 py-1.5 drop-shadow-lg rounded-md border border-gray-600 hover:bg-gray-600 text-gray-600 hover:text-white transition-colors duration-75 text-lg font-semibold">
                      Batal
                    </button>
                    <button onClick={handleDelete} className="flex-auto px-4 py-1.5 drop-shadow-lg rounded-md bg-red-500 hover:bg-red-600 text-lg font-semibold text-slate-100">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <EditorContentStyles />
            <EditorContent editor={editor} className="overflow-y-auto" />
          </TiptapTemplate>
        </form>
        <button onClick={() => {
          if (audienceGradeFormFirstTimeOpened) {
            grade7.current.checked = audienceGrades['7'] ?? false
            grade8.current.checked = audienceGrades['8'] ?? false
            grade9.current.checked = audienceGrades['9'] ?? false
            setAudienceGradeFormFirstTimeOpened(false)
          }
          setAudienceGradeFormHidden(false)
          }} 
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

}

export async function getStaticPaths() {
  const announcements = await prisma.announcement.findMany({
    select: {
      id: true
    }
  })
  return {
    paths: announcements.map((announcement) => ({
      params: { id: announcement.id.toString() }
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const announcement = await prisma.announcement.findUnique({
    where: {
      id: Number(params.id)
    }
  })
  return {
    props: {
      announcement: JSON.parse(JSON.stringify(announcement))
    }
  }
}
