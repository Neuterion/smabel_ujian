import Head from 'next/head'
import Link from 'next/link'

import { prisma } from '../../../../../lib/prisma'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faGear, faTableCells, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useRef, useState } from 'react'

export default function EditExam({ exam, question }) {
  exam = JSON.parse(exam)
  question = JSON.parse(question)

  // To compare with the form settings on change
  const { name, duration, grade, subject } = exam
  const initialSettings = {name, duration, grade, subject}

  const [testNameLabel, testGradeLabel, formRef, submitBtnRef] = [useRef(), useRef(), useRef(), useRef()]
  const [settingsHidden, setSettingsHidden] = useState(true)

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

  const handleSubmit = async (e, formRef) => {
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
  return (
    <main>
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
      <article className="flex justify-evenly">
        <section>
          {question.question}
        </section>
        <section>
          {question.choices.map((choice) => (
            <h1 key={choice.id}>
              {choice.choice}
            </h1>
          ))}
        </section>
      </article>
      <div id="settings" className={`${settingsHidden ? 'hidden' : ''} absolute grid place-items-center inset-0 bg-black/50 z-50`}>
        <div className="relative w-[50vmin] p-6 rounded-lg font-inter bg-emerald-900 text-white shadow-xl shadow-emerald-900/50">
          <button id="closeSettings" onClick={() => setSettingsHidden(true)} className="absolute -top-7 -right-6 text-2xl font-bold">
            &#10005;
          </button>
          <h1 className="pt-1 pb-4 text-3xl text-center font-semibold">
            Setelan Ujian
          </h1>
          <form ref={formRef} action="/api/ujian/edit-settings" method="post" onSubmit={(e) => handleSubmit(e, formRef)} className="flex flex-col items-start gap-y-4">
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
    </main>
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
