import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { prisma } from '../../../../../lib/prisma'

// Disable auto CSS load to prevent large icon flash
import { config } from '@fortawesome/fontawesome-svg-core' 
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faGear, faTableCells, faPlus } from '@fortawesome/free-solid-svg-icons'

import { React, useRef, useState, forwardRef, createRef, useImperativeHandle } from 'react'

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
  const [testNameLabel, testGradeLabel, formRef, submitBtnRef, saveBtnRef] =
        [useRef(), useRef(), useRef(), useRef(), useRef()]
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
    const res = await fetch('/api/ujian/edit/settings', {
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
  const [questionRef, optARef, optBRef, optCRef, optDRef] = [createRef(), createRef(), createRef(), createRef(), createRef()]

  // QUESTION - Handle question & choices when changed (unoptimized)
  const handleQuestionChange = async () => {
    // set save button onclick prop to null
    saveBtnRef.current.onClick = null

    // gather data
    const updateTime = Date.now()
    const questionProps = questionRef.current.getData()
    console.log(questionProps)
    const [optAProps, optBProps, optCProps, optDProps] = 
          [optARef.current.getData(), optBRef.current.getData(), optCRef.current.getData(), optDRef.current.getData()]

    const res = await fetch('/api/ujian/edit/question', {
      method: 'POST',
      body: JSON.stringify({
        _question: {
          question: questionProps.question,
          id: question.id,
          updatedAt: updateTime
        },
        opt_a: {
          choice: optAProps.choice,
          isCorrect: optAProps.isCorrect,
          id: question.choices[0].id,
          updatedAt: updateTime,
          questionId: question.id,
        },
        opt_b: {
          choice: optBProps.choice,
          isCorrect: optBProps.isCorrect,
          id: question.choices[1].id,
          updatedAt: updateTime,
          questionId: question.id,
        },
        opt_c: {
          choice: optCProps.choice,
          isCorrect: optCProps.isCorrect,
          id: question.choices[2].id,
          updatedAt: Date.now(),
          questionId: question.id,
        },
        opt_d: {
          choice: optDProps.choice,
          isCorrect: optDProps.isCorrect,
          id: question.choices[3].id,
          updatedAt: updateTime,
          questionId: question.id,
        },
      })
    })
    if (res.ok) {
      console.log("OK")
      // saveBtnRef.current.textContent = "✅"

      const json = await res.json()
      console.log(json)

      setTimeout(() => {
        // saveBtnRef.current.textContent = "Simpan"
        saveBtnRef.current.onClick = handleQuestionChange
      }, 1000)    
    }
  }

  // QUESTION LIST - Question list state
  const [questionListShown, setQuestionListShown] = useState()

  // QUESTION LIST - Prepare to render question buttons
  const questionLinkBtns = []
  for (let i = 1; i <= exam.questionCount; i++) {
    questionLinkBtns.push(i)
  }

  // EXAM & QUESTION DELETE - state
  let [QuestionDeleteShown, setQuestionDeleteShown] = useState(false)
  if (parseInt(question.order) === 1) {
    QuestionDeleteShown = null
    setQuestionDeleteShown = null
    console.log(QuestionDeleteShown)
  }
  const [ExamDeleteShown, setExamDeleteShown] = useState(false)

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
          <button onClick={() => setQuestionListShown(true)} className="inline-flex items-center gap-x-2 py-2 px-3 mx-0.5 rounded-md transition-colors duration-150 bg-slate-50 text-teal-700 hover:bg-slate-100 active:bg-slate-200">
            <FontAwesomeIcon icon={faTableCells} />
            Lihat semua
          </button>
        </div>
        <div className="inline-flex w-1/3 justify-end gap-x-2">
          <button ref={saveBtnRef} onClick={(e) => handleQuestionChange(e)} className="inline-flex items-center gap-x-2 py-2 px-3 rounded-md transition-colors duration-150 bg-teal-800 hover:bg-teal-900 shadow-md select-none">
            <FontAwesomeIcon icon={faFloppyDisk} />
            Simpan
          </button>
          <form method="POST" action="/api/ujian/create/question">
            <input type="text" name="exam_id" value={exam.id} readOnly hidden />
            <input type="number" name="prevQuestionCount" value={exam.questionCount} readOnly hidden />
            <button type="submit" className="inline-flex items-center gap-x-2 py-2 px-3 rounded-md transition-colors duration-150 hover:bg-teal-800 select-none">
              <FontAwesomeIcon icon={faPlus} />
              Buat baru
            </button>
          </form>
          <button onClick={() => setSettingsHidden(false)} className="inline-flex items-center gap-x-2 py-2 px-3 rounded-md transition-colors duration-150 hover:bg-teal-800 select-none">
            <FontAwesomeIcon icon={faGear} />
            Setelan
          </button>
        </div>
      </nav>

      {/* Hidden menus */}
      <section id="settings-form" className={`${settingsHidden ? 'hidden' : ''} absolute grid place-items-center inset-0 bg-black/50 z-50`}>
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
            <div className="w-full flex gap-3 justify-center">
              <div onClick={() => setQuestionDeleteShown(true)} className={`${QuestionDeleteShown === null ? 'hidden' : ''} cursor-pointer w-fit px-3 py-2 rounded-2xl font-semibold bg-red-600 text-slate-100`}>
                Hapus pertanyaan
              </div>
              <input type="text" name="id" value={exam.id} readOnly hidden />
              <div onClick={() => setExamDeleteShown(true)} className="cursor-pointer w-fit px-3 py-2 rounded-2xl font-semibold bg-red-600 text-slate-100">
                Hapus ujian
              </div>
            </div>
          </form>
        </div>
      </section>
      <section id="deleteQuestionConfirmation" className={`absolute inset-0 bg-black/50 ${QuestionDeleteShown ? 'grid z-[99]' : 'hidden'} place-items-center`}>
        <form method="POST" action="/api/ujian/delete/question" className="flex flex-col items-center p-6 drop-shadow-lg rounded-xl bg-slate-100 font-inter text-2xl font-bold">
          <input type="text" name="id" value={question.id} readOnly hidden />
          <input type="text" name="exam_id" value={exam.id} readOnly hidden />
          <input type="number" name="order" value={question.order} readOnly hidden />
          <h1 className="my-2">
            Apakah anda yakin ingin menghapus pertanyaan ini?
          </h1>
          <div className="flex items-center gap-2 font-semibold text-xl">
            <button type="submit" className="p-3 rounded-lg bg-red-600 hover:bg-red-700 text-slate-200">
              Hapus
            </button>
            <div onClick={() => setQuestionDeleteShown(false)} className="cursor-pointer p-3 rounded-lg border border-slate-900 hover:border-black text-slate-900 hover:text-black">
              Tidak
            </div>
          </div>
        </form>
      </section>
      <section id="examQuestionConfirmation" className={`absolute inset-0 bg-black/50 ${ExamDeleteShown ? 'grid z-[99]' : 'hidden'} place-items-center`}>
        <form method="POST" action="/api/ujian/delete/exam" className="flex flex-col items-center p-6 drop-shadow-lg rounded-xl bg-slate-100 font-inter text-2xl font-bold">
          <input type="text" name="id" value={exam.id} readOnly hidden />
          <h1 className="my-2">
            Apakah anda yakin ingin menghapus ujian ini?
          </h1>
          <div className="flex items-center gap-2 font-semibold text-xl">
            <button type="submit" className="p-3 rounded-lg bg-red-600 hover:bg-red-700 text-slate-200">
              Hapus
            </button>
            <div onClick={() => setExamDeleteShown(false)} className="cursor-pointer p-3 rounded-lg border border-slate-900 hover:border-black text-slate-900 hover:text-black">
              Tidak
            </div>
          </div>
        </form>
      </section>
      <section id="question-list" className={`${questionListShown ? 'grid z-50' : 'hidden'} absolute inset-0 place-items-center bg-black/50`}>
        <div className="w-1/2 rounded-xl bg-slate-100">
          <div className="flex justify-between mx-5 mt-6 mb-2">
            <h1 className="font-inter text-2xl font-bold drop-shadow-lg">
              Soal Ujian
            </h1>
            <button onClick={() => setQuestionListShown(false)} className="text-red-700 font-extrabold text-2xl">
              &#10005;
            </button>
          </div>
          <div className="flex flex-wrap gap-1 bg-teal-700/30 p-4 rounded-b-lg">
            {questionLinkBtns.map(index => (
              <QuestionLink key={index} exam_id={exam.id} order={index} />
            ))}
          </div>
        </div>
      </section>


      {/* Question editor */}
      <article className="flex-auto h-full p-3 grid grid-cols-3 grid-rows-2 gap-3">
        <section className="row-span-2 h-full overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar ref={questionRef} content={question.question} isChoice={false}>
            Pertanyaan
          </ExamNavbar>
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar ref={optARef} content={question.choices[0].choice} isChoice={true} isCorrect={question.choices[0].isCorrect}>
            Opsi A
          </ExamNavbar>
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar ref={optBRef} content={question.choices[1].choice} isChoice={true} isCorrect={question.choices[1].isCorrect}>
            Opsi B
          </ExamNavbar>
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar ref={optCRef} content={question.choices[2].choice} isChoice={true} isCorrect={question.choices[2].isCorrect}>
            Opsi C
          </ExamNavbar>
        </section>
        <section className="overflow-y-auto border-2 border-teal-700 rounded-lg p-2">
          <ExamNavbar ref={optDRef} content={question.choices[3].choice} isChoice={true} isCorrect={question.choices[3].isCorrect}>
            Opsi D
          </ExamNavbar>
        </section>
      </article>
    </main>
  )
}

const ExamNavbar = forwardRef((props, ref) => {
  // Checkbox input state
  const [checked, setChecked] = useState(props.isCorrect)

  // Submitting data to parent component on save
  useImperativeHandle(ref, () => ({
    getData() {
      if (!props.isChoice) {
        return {
          question: editor.getHTML()
        }
      }
      return {
        isCorrect: checked,
        choice: editor.getHTML()
      }
    }
  }))

  // Overriding default content with current content
  const newEditorConfig = {...EditorConfig}
  newEditorConfig.content = props.content ?? ''

  // New editor context & bind it to ref
  const editor = useEditor(newEditorConfig)

  return (
    <>
      <nav className="flex justify-between -m-2 mb-1 p-2 bg-teal-700 text-slate-100">
        <div className="flex mx-1">
          { props.isChoice ? <input type="checkbox" onChange={() => setChecked(!checked)} className="w-8 mr-2" checked={checked} /> : null }
          <h3 className="my-auto text-lg font-semibold font-inter">
            {props.children}
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
})

const ExamEditorContentStyles = () => {
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

// Question list button
const QuestionLink = ({ exam_id, order }) => {
  return (
    <a href={`/teacher/ujian/${exam_id}/${order}/edit`} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl shadow-md">
      <h4 className="font-inter font-semibold text-lg">
        {order}
      </h4>
    </a>
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
