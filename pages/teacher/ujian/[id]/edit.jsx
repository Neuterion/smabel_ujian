import Head from 'next/head'
import Link from 'next/link'

import { prisma } from '../../../../lib/prisma'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faGear, faTableCells, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function EditExam({ exam }) {
  exam = JSON.parse(exam)
  console.log(exam)
  return (
    <main>
      <Head>
        <title>115 | Edit Ujian</title>
      </Head>
      <nav id="exam-navbar" className="flex items-center p-3 drop-shadow-xl bg-teal-700 text-slate-50 font-semibold">
        <Link href="/teacher/dashboard">
          <button className="inline-flex w-1/3 py-2 px-3 rounded-md transition-colors duration-150 hover:bg-teal-800 select-none">
            &larr; Balik
          </button>
        </Link>
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
              (x)
            </span> 
            {" "} dari {" "}
            <span className="font-extrabold">
              {exam.questions.length}
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
          <button className="inline-flex items-center gap-x-2 py-2 px-3 rounded-md transition-colors duration-150 hover:bg-teal-800 select-none">
            <FontAwesomeIcon icon={faGear} />
            Setelan
          </button>
        </div>
      </nav>
      <article className="flex justify-evenly">
        <section>
          (EDIT: exam question)
        </section>
        <section>
          (EDIT: exam choices)
        </section>
      </article>
    </main>
  )
}

export async function getStaticPaths() {
  const exams = await prisma.exam.findMany({
    select: {
      id: true,
      questions: {
        select: {
          id: true
        }
      }
    }
  })

  const paths = exams.map(exam => ({
    params: {
      id: exam.id.toString()
    }
  }))

  return {
    paths: paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const exam = await prisma.exam.findUnique({
    where: {
      id: params.id
    },
    include: {
      questions: {
        include: {
          choices: true
        }
      }
    }
  })

  return {
    props: {
      exam: JSON.stringify(exam)
    }
  }
}
