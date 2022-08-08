import { prisma } from '../../../../lib/prisma'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Head from 'next/head'
import Link from 'next/link'

import React, { useState, useRef } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapTemplate, MenuBarStyles, MenuButtons, EditorConfig, EditorContentStyles } from '../../../../components/tiptap/tiptap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

export default function EditAnnouncement({ announcement }) {
  // Setting form data on edit
  const editFormRef = useRef()
  const editIdInput = useRef()
  const deleteIdInput = useRef()
  const contentInput = useRef()
  const [title, setTitle] = useState(announcement.title)
  const titleInput = useRef()
  titleInput.current?.addEventListener('focusout', () => {
    if (titleInput.current.value === '') setTitle(announcement.title)
  })
  const editDateInput = useRef()

  // Handling form edit
  const handleEdit = () => {
    // Check for changes
    if (titleInput.current.value === announcement.title && editor.getHTML() === announcement.content) return

    // Inserting data from the editor into hidden form inputs
    contentInput.current.value = editor.getHTML()
    editIdInput.current.value = announcement.id
    editDateInput.current.value = new Date().toString()
    editFormRef.current.submit()
  }

  // Delete form ref
  const deleteFormRef = useRef()

  // Delete confirmation form ref
  const deleteConfirmationWrapper = useRef()
  const [hidden, setHidden] = useState(true)

  // Handling form deletion
  const handleDelete = () => {
    deleteIdInput.current.value = announcement.id
    deleteFormRef.current.submit()
  }

  EditorConfig['autofocus'] = true
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
        <Link href="/teacher/dashboard">
          <FontAwesomeIcon icon={faHouse} className="absolute top-0 left-0 pt-3 pl-3 pb-6 pr-6 text-3xl rounded-br-full text-white bg-slate-800 hover:bg-slate-900 drop-shadow-lg cursor-pointer" />
        </Link>
        <form ref={editFormRef} action="/api/pengumuman/edit" method="post" onSubmit={(e) => e.preventDefault()} className="will-change-auto flex-auto w-full flex overflow-y-auto">
          <TiptapTemplate>
            <div className="flex flex-col w-full bg-slate-100">
              <input
                ref={titleInput} type="text" name="title" 
                onChange={() => setTitle(titleInput.current.value)} value={title} autoComplete="off" 
                className="bg-inherit h-full outline-none border-2 border-transparent focus:border-slate-200 mx-2 mt-2 py-2 text-center text-3xl italic"
              />
              <div className={`${MenuBarStyles} items-center content-center`}>
                <MenuButtons editor={editor}>
                  <button onClick={handleEdit} className="px-4 py-2 text-lg font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded-md">
                    Simpan
                  </button>
                  <button onClick={() => setHidden(false)} className="px-4 py-2 text-lg font-normal border border-red-500 hover:bg-red-500 text-red-500 hover:text-white rounded-md">
                    Hapus
                  </button>
                </MenuButtons>
              </div>
            </div>
            <EditorContentStyles />
            <EditorContent editor={editor} className="overflow-y-auto" />
            <input ref={editIdInput} type="hidden" name="id" value="" />
            <input ref={editDateInput} type="hidden" name="editDate" value="" />
            <input ref={contentInput} type="hidden" name="content" value="" />
          </TiptapTemplate>
        </form>
        <form ref={deleteFormRef} action="/api/pengumuman/delete" method="post" onSubmit={(e) => e.preventDefault()}>
          <input ref={deleteIdInput} type="hidden" name="id" value="" />
        </form>
        <div id="deleteConfirmationWrapper" ref={deleteConfirmationWrapper} className={`absolute inset-0 bg-black/50 flex justify-center items-center ${hidden ? "hidden" : ""}`}>
          <div id="deleteConfirmation" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg font-inter transition-opacity duration-150">
            <h1 className="text-2xl font-semibold">
              Apakah Anda yakin ingin menghapus pengumuman ini?
            </h1>
            <div className="flex justify-center w-full gap-14 mt-2">
              <button onClick={() => setHidden(true)} className="flex-auto px-4 py-1.5 drop-shadow-lg rounded-md border border-gray-600 hover:bg-gray-600 text-gray-600 hover:text-white transition-colors duration-75 text-lg font-semibold">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-auto px-4 py-1.5 drop-shadow-lg rounded-md bg-red-500 hover:bg-red-600 text-lg font-semibold text-slate-100">
                Hapus
              </button>
            </div>
          </div>
        </div>
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
