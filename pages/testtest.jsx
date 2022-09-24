import { Question } from '../components/tiptap'

export default () => {
  return (
    <main className="flex-auto m-5">
      <div className="w-full flex flex-col gap-y-5">
        <Question />
        <Question />
        <Question />
        <Question />
      </div>
    </main>
  )
}