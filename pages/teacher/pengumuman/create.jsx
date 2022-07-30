import Head from 'next/head'
import Tiptap from '../../../components/tiptap/tiptap'

export default () => {
  return (
    <main className="max-h-[100vh] flex-auto flex flex-col items-center justify-start p-4">
      <Head>
        <title>115 | Buat Pengumuman</title>
      </Head>
      <Tiptap isForm={true} />
    </main>
  )
}