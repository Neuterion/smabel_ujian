import { Question } from '../components/tiptap/tiptap'

export default () => {
  return (
    <main>
      <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 w-5/12">
        <Question />
        <Question />
        <Question />
      </div>
    </main>
  )
}