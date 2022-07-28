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

import EditorStyles from './styles/editor'

const MenuBar = ({ editor }) => {
  const [choice, setChoice] = useState('')
  const uploadImage = useRef(null)
  if (!editor) {
    return null
  }
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
  return (
    <div className="flex sm:justify-center flex-wrap p-2 gap-x-4 gap-y-2 bg-slate-100">
      <div id="undo-redo" className="flex flex-row flex-wrap">
        <button className="p-2 hover:bg-slate-200 focus:bg-slate-300" onClick={() => editor.chain().focus().undo().run()}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button className="p-2 hover:bg-slate-200 focus:bg-slate-300" onClick={() => editor.chain().focus().redo().run()}>
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
      </div>
      <div id="text-style" className="flex flex-row flex-wrap bg-slate-100">
        <div className="p-1 hover:bg-slate-200">
          <select id="text-styles-dropdown" className="p-2 outline-none w-full" value={choice} onChange={(e) => {
            const value = e.target.value
            setChoice(value)
            toggleTextStyle(value)
          }}>
            <option value="" disabled>Style text</option>
            <option
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`text-lg ${editor.isActive('paragraph') ? 'is-active' : ''}`}
              value="p"
            >
              Normal text
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
      <div id="text-align" className="flex flex-row flex-wrap bg-slate-100">
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
      <div id="upload-image" className="flex flex-row flex-wrap bg-slate-100">
        <div className="flex">
          <input type="file" accept="image/*" className="hidden" multiple ref={uploadImage} onChange={(e) => {
            const files = e.target.files
            if (files.length > 0) {
              for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const reader = new FileReader()
                reader.onload = (e) => {
                  const src = e.target.result
                  editor.commands.setImage({ src })
                }
                reader.readAsDataURL(file)
              }
            }
          }} />
          <button
            onClick = {() => {
              uploadImage.current.click()
            }}
            className="p-2 hover:bg-slate-200 active:bg-slate-300"
          >
            <FontAwesomeIcon icon={faImage} />
          </button>
        </div>
      </div>
      <div id="misc" className="flex flex-row flex-wrap bg-slate-100">
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
    </div>
  )
}

export default function Tiptap() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'paragraph') {
            return "Tell us more about it..."
          }
          else if (node.type.name === 'heading') {
            return "What's the topic?"
          }
        }
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
    ],
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That’s a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
      </p>
      <pre>
<code class="language-css">body {
  display: none;
}</code></pre>
      <p>
        I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
    `
  })

  return (
    <div className="flex flex-col m-2 divide-y-2 divide-slate-900 border-2 border-slate-900" spellCheck="false">
      <MenuBar editor={editor} />
      <EditorStyles />
      <form className="flex flex-col divide-y-2 divide-slate-900">
        <EditorContent editor={editor} />
        <button type="submit" className="" onClick={() => {
          const content = editor.getHTML()
          console.log(JSON.stringify(content))
        }}>
          Submit
        </button>
      </form>
    </div>
  )
}