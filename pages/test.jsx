import Tiptap from '../components/tiptap/tiptap'
import { prisma } from '../lib/prisma'

export default function Test({ exam }) {
  console.log(JSON.parse(exam.questions))
  return (
    <main className="flex-auto p-3">
    </main>
  )
}

export async function getStaticProps() {
  const exams = await prisma.exam.findMany({
    select: {
      id: true,
      questions: true
    }
  })
  console.log(exams[0].questions)

  return {
    props: {
      exam: JSON.stringify(exams)
    }
  }
}
