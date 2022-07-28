import Head from 'next/head'

export default () => {
  return (
    <main className="flex-auto flex flex-col justify-center items-center">
      <Head>
        <title>115 | Buat Pengumuman</title>
      </Head>
      <div className="flex flex-col p-6 bg-slate-100 rounded-md drop-shadow-md w-[75vmin]">
        <h1 className="py-2 text-center text-4xl font-bold text-blue-900/90 underline">
          Pengumuman Baru
        </h1>
        <form className="flex flex-col" action="/api/buat-pengumuman" method="post">
          <label htmlFor="title" className="text-xl font-semibold pt-3 pb-1">
            Judul
          </label>
          <input type="text" name="title" placeholder="Apa topik dari pengumuman?" className="p-2" />
          <label htmlFor="description" className="text-xl font-semibold pt-3 pb-1">
            Deskripsi
          </label>
          <textarea type="text" name="description" placeholder="Uraikan lebih lanjut... (opsional)" className="p-2 min-h-[100px]" wrap="hard" />
          <button type="submit" className="px-4 py-2 mt-4 mx-auto text-lg font-bold bg-blue-500 hover:bg-blue-700 text-white rounded-md">
            Simpan
          </button>
        </form>
      </div>
    </main>
  )
}