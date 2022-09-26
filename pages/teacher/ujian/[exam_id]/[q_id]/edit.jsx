import Head from 'next/head'
import Link from 'next/link'

import { prisma } from '../../../../../lib/prisma'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faGear, faTableCells, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useRef, useState } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'

import { EditorConfig } from '../../../../../components/tiptap'
import { ExamMenuButtons } from '../../../../../components/tiptap/exam'

export default function EditExam({ exam, question }) {
  // DATA
  exam = JSON.parse(exam)
  question = JSON.parse(question)

  // SETTINGS - To compare with the form settings on change
  const { name, duration, grade, subject } = exam
  const initialSettings = {name, duration, grade, subject}

  // SETTINGS - Settings menu refs/states
  const [testNameLabel, testGradeLabel, formRef, submitBtnRef] = [useRef(), useRef(), useRef(), useRef()]
  const [settingsHidden, setSettingsHidden] = useState(true)

  // SETTINGS - Settings menu form text field animation on focus
  const moveLabelToTop = (e, ref) => {
    const label = ref.current
    if (e.target.value !== '') return
    label.classList.add('-translate-y-[150%]')
    label.classList.remove('-translate-y-1/2')
    label.classList.remove('text-gray-300')
  }
  const moveLabelToBottom = (e, ref) => {
    const label = ref.current
    if (e.target.value !== '') return
    label.classList.remove('-translate-y-[150%]')
    label.classList.add('-translate-y-1/2')
    label.classList.add('text-gray-300')
  }

  // SETTINGS - Handle settings when changed
  const handleSettingChange = async (e, formRef) => {
    e.preventDefault()

    // Get the form data
    const formData = new FormData(formRef.current)
    const data = Object.fromEntries(formData)
    data.duration = Number(data.duration)
    data.grade = Number(data.grade)

    const dataStr = Object.entries(data).toString()
    const initSettingsStr = Object.entries(initialSettings).toString()

    // Checking for changes
    const hasChanged = dataStr !== initSettingsStr
    if (!hasChanged) return

    // Initiate the request
    formRef.current.onSubmit = null
    submitBtnRef.current.textContent = '...'
    const res = await fetch('/api/ujian/edit-settings', {
      method: 'POST',
      body: JSON.stringify({id: exam.id, data})
    })
    if (res.ok) {
      submitBtnRef.current.textContent = '✅'
      
      // Modify initial settings
      const json = await res.json()
      initialSettings = {
        name: json.name, 
        duration: json.duration, 
        grade: json.grade, 
        subject: json.subject
      }

      setTimeout(() => {
        submitBtnRef.current.textContent = 'Ubah setelan'
        formRef.current.onSubmit = (e) => handleSubmit(e, formRef)
      }, 1000)
    }
  }

  // QUESTION - Question/choices refs
  

  // QUESTION - Handle question & choices when changed
  const handleQuestionChange = async (e) => {
    // gather data & submit (unoptimized)

  }

  return (
    <main className="flex-auto flex flex-col h-[100vh]">
      <Head>
        <title>115 | Edit Ujian</title>
      </Head>
      <nav id="exam-navbar" className="flex items-center p-3 drop-shadow-xl bg-teal-700 text-slate-50 font-semibold">
        <div className="inline-flex w-1/3">
          <Link href="/teacher/dashboard">
            <button className="py-2 px-3 rounded-md transition-colors duration-150 hover:bg-teal-800 select-none">
              &larr; Balik
            </button>
          </Link>
        </div>
        <div className="inline-flex w-1/3 gap-x-2 justify-center items-center">
          <h3>
            <span className="italic">
              {exam.name}
            </span>
            <span className="mx-1">
              &bull;
            </span>
            Pertanyaan {" "} 
            <span className="font-extrabold">
              {question.order}
            </span> 
            {" "} dari {" "}
            <span className="font-extrabold">
              {exam.questionCount}
            </span>
          </h3>
          <button className="inline-flex items-center gap-x-2 py-2 px-3 mx-0.5 rounded-md transition-colors duration-150 bg-slate-50 text-teal-700 hover:bg-slate-100 active:bg-slate-200">
            <FontAwesomeIcon icon={faTableCells} />
            Lihat semua
          </button>
        </div>
        <div className="inline-flex w-1/3 justify-end gap-x-2">
          <button className="inline-flex items-center gap-x-2 py-2 px-3 rounded-md transition-colors duration-150 bg-teal-800 hover:bg-teal-900 shadow-md select-none">
            <FontAwesomeIcon icon={faFloppyDisk} />
            Simpan
          </button>
          <button className="inline-flex items-center gap-x-2 py-2 px-3 rounded-md transition-colors duration-150 hover:bg-teal-800 select-none">
            <FontAwesomeIcon icon={faPlus} />
            Buat baru
          </button>
          <button onClick={() => setSettingsHidden(false)} className="inline-flex items-center gap-x-2 py-2 px-3 rounded-md transition-colors duration-150 hover:bg-teal-800 select-none">
            <FontAwesomeIcon icon={faGear} />
            Setelan
          </button>
        </div>
      </nav>
      <div id="settings" className={`${settingsHidden ? 'hidden' : ''} absolute grid place-items-center inset-0 bg-black/50 z-50`}>
        <div className="relative w-[50vmin] p-6 rounded-lg font-inter bg-emerald-900 text-white shadow-xl shadow-emerald-900/50">
          <button id="closeSettings" onClick={() => setSettingsHidden(true)} className="absolute -top-7 -right-6 text-2xl font-bold">
            &#10005;
          </button>
          <h1 className="pt-1 pb-4 text-3xl text-center font-semibold">
            Setelan Ujian
          </h1>
          <form ref={formRef} action="/api/ujian/edit-settings" method="post" onSubmit={(e) => handleSettingChange(e, formRef)} className="flex flex-col items-start gap-y-4">
            <div className="w-full relative">
              <input 
                required autoComplete="off" spellCheck="off" name="name" type="text" defaultValue={exam.name}
                onFocus={(e) => moveLabelToTop(e, testNameLabel)}
                onBlur={(e) => moveLabelToBottom(e, testNameLabel)}
                className="w-full p-2 rounded-md outline-none bg-transparent border border-white" 
              />
              <label 
                htmlFor="nama-ujian" ref={testNameLabel} 
                className="absolute left-0 mx-1 px-1 top-1/2 -translate-y-[150%] text-sm select-none pointer-events-none bg-emerald-900 transition-all duration-500"
              >
                Nama Ujian
              </label>
            </div>
            <div className="w-full relative">
              <input
                required name="duration" type="number" defaultValue={exam.duration}
                onFocus={(e) => moveLabelToTop(e, testGradeLabel)}
                onBlur={(e) => moveLabelToBottom(e, testGradeLabel)}
                className="w-full p-2 rounded-md outline-none bg-transparent border border-white" 
              />
              <label 
                htmlFor="kelas-ujian" ref={testGradeLabel} 
                className="absolute left-0 mx-1 px-1 top-1/2 -translate-y-[150%] text-sm select-none pointer-events-none bg-emerald-900 transition-all duration-500"
              >
                Waktu Pengerjaan Ujian (menit)
              </label>
            </div>

            <section className="flex flex-col text-white">
              <h1 className="text-xl font-medium">
                Kelas yang Diuji
              </h1>
              <select required defaultValue={exam.grade.toString()} name="grade" className="p-1 text-neutral-900 outline-blue-500">
                <option value="7">Kelas 7</option>
                <option value="8">Kelas 8</option>
                <option value="9">Kelas 9</option>
              </select>
            </section>
            
            <section>
              <h2 className="text-xl font-medium">Mata Pelajaran</h2>
              <select required defaultValue={exam.subject} name="subject" className="p-1 text-neutral-900 outline-blue-500">
                <option value="mtk">Matematika</option>
                <option value="b-indo">Bahasa Indonesia</option>
                <option value="ipa">IPA</option>
                <option value="ips">IPS</option>
                <option value="b-ing">Bahasa Inggris</option>
                <option value="ppkn">PPKn</option>
                <option value="senbud">Seni Budaya</option>
                <option value="agama-islam">Agama Islam</option>
                <option value="agama-kristen">Agama Kristen</option>
                <option value="agama-katolik">Agama Katolik</option>
                <option value="agama-hindu">Agama Hindu</option>
                <option value="tik">Informatika</option>
                <option value="pjok">PJOK</option>
              </select>
            </section>

            <button ref={submitBtnRef} type="submit" className="w-fit px-3 py-2 -mb-2 mx-auto rounded-2xl font-semibold border border-white hover:bg-white hover:text-emerald-900 transition-colors duration-150">
              Ubah setelan
            </button>
          </form>
        </div>
      </div>

      {/* Question editor */}
      <article className="flex-auto h-full p-3 grid grid-cols-3 grid-rows-2 gap-3">
        <section className="row-span-2 h-full overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar content={question.question} header={'Pertanyaan'} isChoice={false} />
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar key={question.choices[0].id} content={question.choices[0].choice} header={'Opsi A'} isChoice={true} />
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar key={question.choices[1].id} content={question.choices[0].choice} header={'Opsi B'} isChoice={true} />
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar key={question.choices[2].id} content={question.choices[0].choice} header={'Opsi C'} isChoice={true} />
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar key={question.choices[3].id} content={question.choices[0].choice} header={'Opsi D'} isChoice={true} />
        </section>
      </article>
    </main>
  )
}

export function ExamNavbar({ content, header, isChoice }) {
  // Overriding default content with current content
  const newEditorConfig = {...EditorConfig}
  newEditorConfig.content = content ?? ''

  // New editor context
  const editor = useEditor(newEditorConfig)

  return (
    <>
      <nav className="flex justify-between -m-2 mb-1 p-2 bg-teal-700 text-slate-100">
        <div className="flex mx-1">
          {isChoice ? <input type="checkbox" className="w-8 mr-2" /> : null}
          <h3 className="my-auto text-lg font-semibold font-inter">
            {header}
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
}

export function ExamEditorContentStyles() {
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

export async function getStaticPaths() {
  const exams = await prisma.exam.findMany({
    select: {
      id: true,
      questions: true
    }
  })

  const paths = []
  exams.forEach(exam => {
    exam.questions.forEach((question, index) => {
      paths.push({
        params: {
          exam_id: exam.id.toString(),
          q_id: (index+1).toString()
        }
      })
    })
  })

  return {
    paths: paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const exam = await prisma.exam.findUnique({
    where: {
      id: params.exam_id
    },
    include: {
      questions: {
        include: {
          choices: true
        }
      }
    }
  })
  const question = exam.questions[params.q_id-1]
  question.order = params.q_id
  exam.questionCount = exam.questions.length
  delete exam.questions

  return {
    props: {
      exam: JSON.stringify(exam),
      question: JSON.stringify(question)
    }
  }
}
