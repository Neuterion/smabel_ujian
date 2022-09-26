import { EditorContent, useEditor } from '@tiptap/react'

import React, { useState, useRef } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBold, faItalic, faImage } from "@fortawesome/free-solid-svg-icons"

import { EditorContentStyles, EditorConfig } from './'

export function Answer() {
  const editor = useEditor(EditorConfig)
  return (
    <div className="flex-auto flex flex-col overflow-x-auto border border-slate-900" spellCheck="false">
      <div className="relative flex justify-between">
        <div className="m-1">
          <MenuButtons editor={editor} />
        </div>
        <input type="checkbox" className="absolute top-0 right-0 bottom-0 mr-2 w-8" />
      </div>
      <EditorContentStyles />
      <div>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export const ExamMenuButtons = ({ editor }) => {
  const uploadImage = useRef(null) // -> toggleImageUpload()

  if (!editor) return null

  const toggleImageUpload = (e) => {
    const files = e.target.files
    console.log(files)

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        const reader = new FileReader()
        reader.onload = () => {
          // Create image element, resize on canvas element, and convert to base64
          const img = document.createElement('img')

          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // Set width & height
            canvas.width = 400
            canvas.height = 400 / img.width * img.height

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            // Store base64 string
            const src = canvas.toDataURL()
            editor.commands.setImage({ src })

            // Create new line
            editor.commands.createParagraphNear()
          }

          img.src = reader.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
  return (
    <>
      <div id="text-style" className="flex flex-row flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`mx-0.5 p-2 rounded-lg ${editor.isActive('bold') ? 'is-active bg-teal-900' : 'hover:bg-teal-800'}`}
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`mx-0.5 p-2 rounded-lg ${editor.isActive('italic') ? 'is-active bg-teal-900' : 'hover:bg-teal-800'}`}
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
      </div>
      <div id="upload-image" className="flex flex-row flex-wrap">
        <input type="file" accept="image/*" className="hidden" multiple ref={uploadImage} onChange={toggleImageUpload} />
        <div onClick = {() => uploadImage.current.click()} className="flex items-center mx-0.5 p-2 rounded-lg hover:bg-teal-800 active:bg-teal-800">
          <FontAwesomeIcon icon={faImage} />
        </div>
      </div>
    </>
  )
}
