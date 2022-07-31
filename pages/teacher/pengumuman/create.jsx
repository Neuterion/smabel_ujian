import Head from 'next/head'

import React, { useState, useRef } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import { TiptapTemplate, MenuBarStyles, MenuButtons, EditorConfig, EditorContentStyles } from '../../../components/tiptap/tiptap'

export default () => {
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
    contentInput.current.value = editor.getHTML()
    titleInput.current.value = titleRef.current.value
    form.current.submit()
  }

  return (
    <main className="max-h-[100vh] flex-auto flex flex-col items-center justify-start p-4">
      <Head>
        <title>115 | Buat Pengumuman</title>
      </Head>
      <form ref={formRef} action="/api/buat-pengumuman" method="post" className="flex-auto w-full max-h-full">
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
          <div class="overflow-y-scroll">
            <EditorContent editor={editor} />
          </div>
          <input ref={contentRef} type="hidden" name="content" value="" />
        </TiptapTemplate>
      </form>
    </main>
  )
}

// const MenuBar = ({ editor, form=false, contentInput=false, titleInput=false }) => {
//   const [title, setTitle] = useState('Untitled')
//   const titleRef = useRef(null)

//   if (!editor) return null

//   titleRef.current?.addEventListener('focusout', () => {
//     if (titleRef.current.value === '') setTitle('Untitled')
//   })

//   return (
//     <div class="flex flex-col w-full bg-slate-100">
//       { form && contentInput && titleInput ?
        // <input 
        //   ref={titleRef} type="text" name="title" 
        //   onChange={() => setTitle(titleRef.current.value)} value={title} 
        //   autoComplete="off" className="bg-inherit h-full outline-none border-2 border-transparent focus:border-slate-200 mx-2 mt-2 py-2 text-center text-3xl italic"
        // />
//         : null       
//       }
//       <div className="flex sm:justify-center flex-wrap p-2 gap-x-4 gap-y-2">
//         <MenuButtons editor={editor} />
//         { form && contentInput && titleInput ? 
        // <button onClick={() => {
        //   contentInput.current.value = editor.getHTML()
        //   titleInput.current.value = titleRef.current.value
        //   form.current.submit()
        // }} className="px-4 py-2 text-lg font-bold bg-blue-500 hover:bg-blue-700 text-white rounded-md">
        //   Simpan
        // </button>
//         : null }
//       </div>
//     </div>
//   )
// }

// export default function Tiptap(isForm=false) {
//   const editor = useEditor(editorConfig)
//   if (isForm) {
    // const formRef = useRef(null)
    // const titleRef = useRef(null)
    // const contentRef = useRef(null)
//     return (
//       <div className="w-full flex-auto flex flex-col divide-y-2 overflow-y-auto divide-slate-900 border-2 border-slate-900" spellCheck="false">
//         <MenuBar editor={editor} form={formRef} titleInput={titleRef} contentInput={contentRef} />
//         <ContentStyles />
//         <form ref={formRef} action="/api/buat-pengumuman" method="post" className="overflow-y-auto w-full">
//           <EditorContent editor={editor} />
          // <input ref={titleRef} type="hidden" name="title" value="" />
          // <input ref={contentRef} type="hidden" name="content" value="" />
//         </form>
//       </div>
//     )
//   } else {
//     return (
//       <div className="flex flex-col m-2 divide-y-2 divide-slate-900 border-2 border-slate-900" spellCheck="false">
//         <MenuBar editor={editor} />
//         <ContentStyles />
//         <EditorContent editor={editor} />
//       </div>
//     )
//   }
// }