import Tiptap from '../components/tiptap/tiptap'
import { prisma } from '../lib/prisma'

export default function Test({ question }) {
  const choiceLetters = ['A', 'B', 'C', 'D']
  return (
    <main className="flex-auto p-3">
      <article dangerouslySetInnerHTML={{ __html: question.question }} />
      {question.choices.map((choice, index) => (
        <aside key={choice.id} className="font-inter font-semibold">
          <button onClick={() => {}} className="aspect-square w-8 my-1 mr-2 rounded-full bg-blue-700 hover:bg-blue-800 text-neutral-100">
            {choiceLetters[index]}
          </button>
          <label htmlFor={choice.id}>
            {choice.choice}
          </label>
        </aside>
      ))}
    </main>
  )
}

export async function getStaticProps() {
  const question = await prisma.question.findUnique({
    where: {
      id: 'cl6q32pdk01266osrh1bxnx5w'
    },
    include: {
      exam: {
        select: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      choices: true
    }
  })
  return {
    props: {
      question: JSON.parse(JSON.stringify(question))
    }
  }
}
