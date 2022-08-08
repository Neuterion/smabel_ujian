import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'

import React, { useState, useRef } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faRotateLeft, faRotateRight, faBold, faItalic, faStrikethrough, faCode, 
  faFileCode, faListUl, faListOl, faQuoteLeft, faAlignLeft, faAlignCenter, 
  faAlignRight, faImage
} from "@fortawesome/free-solid-svg-icons"

export function EditorContentStyles() {
  return (
    <style global jsx>{`
      .ProseMirror {
        padding: 0.5rem;
        outline: none;
      }
      .ProseMirror > * + * {
        margin-top: 0.5rem;
      }
      .ProseMirror ul, .ProseMirror ol {
        padding: 0 1rem;
        margin: 0.75rem 0.75rem 0 0.75rem;
      }
      .ProseMirror ul {
        padding: 0 1rem;
        list-style-type: disc;
      }
      .ProseMirror ol {
        padding: 0 1rem;
        list-style-type: decimal;
      }
      .ProseMirror h1 {
        font-size: 3.75rem; /* 60px */
        font-weight: 700;
      }
      .ProseMirror h2 {
        font-size: 3rem; /* 48px */
        font-weight: 700;
      }
      .ProseMirror h3 {
        font-size: 2.25rem; /* 36px */
        font-weight: 600;
      }
      .ProseMirror h4 {
        font-size: 1.875rem; /* 30px */
        font-weight: 600;
      }
      .ProseMirror h5 {
        font-size: 1.5rem; /* 24px */
        font-weight: 500;
      }
      .ProseMirror h6 {
        font-size: 1.25rem; /* 20px */
        font-weight: 500;
      }
      .ProseMirror p {
        font-size: 1.125rem; /* 20px */
      }
      .ProseMirror code {
        background-color: rgba(97, 97, 97, 0.1);
        color: #616161;
      }
      .ProseMirror pre {
        background: #0D0D0D;
        color: #FFF;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        margin-top: 0.25rem;
        border-radius: 0.5rem;
      }
      .ProseMirror pre code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
      .ProseMirror img {
        max-width: 100%;
        height: auto;
        pointer-events: auto;
        user-select: auto;
        margin: 0.5rem 0;
      }
      .ProseMirror blockquote {
        margin-left: 1rem;
        padding-left: 1rem;
        border-left: 2px solid rgba(13, 13, 13, 0.1);
      }
      .ProseMirror hr {
        border: none;
        border-top: 2px solid rgba(13, 13, 13, 0.1);
        margin: 2rem 0;
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }
    `}</style>
  )
}

export const EditorConfig = {
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "Tulis sesuatu..."
    }),
    Image.configure({
      allowBase64: true,
    }),
    Dropcursor.configure({
      color: '#ff0000',
      width: '2px',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    })
  ]
}

export const MenuButtons = ({ editor, children }) => {
  const [textStyle, setTextStyle] = useState('') // -> toggleTextStyle()
  const uploadImage = useRef(null) // -> toggleImageUpload()

  if (!editor) return null

  const toggleTextStyle = (style) => {
    if (style === 'p') {
      editor.chain().focus().setParagraph().run()
    }
    else if (style === 'h1') {
      editor.chain().focus().toggleHeading({ level: 1 }).run()
    }
    else if (style === 'h2') {
      editor.chain().focus().toggleHeading({ level: 2 }).run()
    }
    else if (style === 'h3') {
      editor.chain().focus().toggleHeading({ level: 3 }).run()
    }
    else if (style === 'h4') {
      editor.chain().focus().toggleHeading({ level: 4 }).run()
    }
    else if (style === 'h5') {
      editor.chain().focus().toggleHeading({ level: 5 }).run()
    }
    else if (style === 'h6') {
      editor.chain().focus().toggleHeading({ level: 6 }).run()
    }
  }
  const toggleImageUpload = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.onload = (e) => {
          const src = e.target.result
          editor.commands.setImage({ src })
          editor.commands.createParagraphNear()
        }
        reader.readAsDataURL(file)
      }
    }
  }
  return (
    <>
      <div id="undo-redo" className="flex flex-row flex-wrap">
        <button className="p-2 hover:bg-slate-200 focus:bg-slate-300" onClick={() => editor.chain().focus().undo().run()}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button className="p-2 hover:bg-slate-200 focus:bg-slate-300" onClick={() => editor.chain().focus().redo().run()}>
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
      </div>
      <div id="text-style" className="flex flex-row flex-wrap">
        <div className="p-1 hover:bg-slate-200">
          <select id="text-styles-dropdown" className="p-2 outline-none w-full" value={textStyle} onChange={(e) => {
            const value = e.target.value
            setTextStyle(value)
            toggleTextStyle(value)
          }}>
            <option value="" disabled>Mode teks</option>
            <option
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`text-lg ${editor.isActive('paragraph') ? 'is-active' : ''}`}
              value="p"
            >
              Teks normal
            </option>
            <option
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`text-6xl font-bold ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
              value="h1"
            >
              Heading 1
            </option>
            <option
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`text-5xl font-bold ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
              value="h2"
            >
              Heading 2
            </option>
            <option
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`text-4xl font-semibold ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
              value="h3"
            >
              Heading 3
            </option>
            <option
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              className={`text-3xl font-semibold ${editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}`}
              value="h4"
            >
              Heading 4
            </option>
            <option
              onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
              className={`text-2xl font-medium ${editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}`}
              value="h5"
            >
              Heading 5
            </option>
            <option
              onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
              className={`text-xl font-medium ${editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}`}
              value="h6"
            >
              Heading 6
            </option>
          </select>
        </div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 ${editor.isActive('bold') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 ${editor.isActive('italic') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 ${editor.isActive('strike') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 ${editor.isActive('code') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 ${editor.isActive('blockquote') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 ${editor.isActive('codeBlock') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faFileCode} />
        </button>
      </div>
      <div id="text-align" className="flex flex-row flex-wrap">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 ${editor.isActive({ textAlign: 'left' }) ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 ${editor.isActive({ textAlign: 'center' }) ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 ${editor.isActive({ textAlign: 'right' }) ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </button>
      </div>
      <div id="upload-image" className="flex flex-row flex-wrap">
        <input type="file" accept="image/*" className="hidden" multiple ref={uploadImage} onChange={toggleImageUpload} />
        <div onClick = {() => uploadImage.current.click()} className="flex items-center p-2 hover:bg-slate-200 active:bg-slate-300">
          <FontAwesomeIcon icon={faImage} />
        </div>
      </div>
      <div id="misc" className="flex flex-row flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 ${editor.isActive('bulletList') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 ${editor.isActive('orderedList') ? 'is-active bg-slate-300' : 'hover:bg-slate-200'}`}
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <button className="p-2 hover:bg-slate-200 focus:bg-slate-300" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ─
        </button>
      </div>
      { children }
    </>
  )
}

export const MenuBarStyles = "flex sm:justify-center flex-wrap p-2 gap-x-4 gap-y-2 bg-slate-100"

export const TiptapTemplate = ({ children }) => {
  return (
    <div className="w-full flex-auto flex flex-col divide-y-2 overflow-y-auto divide-slate-900 border-2 border-slate-900" spellCheck="false">
      { children }
    </div>
  )
}

export default function Tiptap() {
  const editor = useEditor(EditorConfig)
  return (
    <TiptapTemplate>
      <div className={MenuBarStyles}>
        <MenuButtons editor={editor} />
      </div>
      <EditorContentStyles />
      <EditorContent editor={editor} />
    </TiptapTemplate>
  )
}