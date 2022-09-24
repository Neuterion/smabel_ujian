import Head from 'next/head'
import { useRef } from 'react'

export default function CreateExam() {
  const [testNameLabel, testGradeLabel] = [useRef(), useRef()]
  const moveLabel = (e, ref) => {
    const label = ref.current
    if (e.target.value !== '') return
    label.classList.toggle('-translate-y-[150%]')
    label.classList.toggle('text-gray-300')
  }
  return (
    <main className="flex-auto grid place-items-center h-full bg-black/10">
      <Head>
        <title>115 | Ujian Baru</title>
      </Head>
      <div className="w-[50vmin] p-6 rounded-lg font-inter bg-emerald-900 text-white shadow-xl shadow-emerald-900/50">
        <h1 className="pt-1 pb-4 text-3xl text-center font-semibold">
          Buat Ujian Baru
        </h1>
        <form action="/api/ujian/create" method="post" className="flex flex-col items-start gap-y-4">
          <div className="w-full relative">
            <input 
              required autoComplete="off" spellCheck="off" name="name" type="text"
              onFocus={(e) => moveLabel(e, testNameLabel)}
              onBlur={(e) => moveLabel(e, testNameLabel)}
              className="w-full p-2 rounded-md outline-none bg-transparent border border-white" 
            />
            <label 
              htmlFor="nama-ujian" ref={testNameLabel} 
              className="absolute left-0 mx-1 px-1 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none bg-emerald-900 text-gray-300 transition-all duration-500"
            >
              Nama Ujian
            </label>
          </div>
          <div className="w-full relative">
            <input
              required name="duration" type="number"
              onFocus={(e) => moveLabel(e, testGradeLabel)}
              onBlur={(e) => moveLabel(e, testGradeLabel)}
              className="w-full p-2 rounded-md outline-none bg-transparent border border-white" 
            />
            <label 
              htmlFor="kelas-ujian" ref={testGradeLabel} 
              className="absolute left-0 mx-1 px-1 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none bg-emerald-900 text-gray-300 transition-all duration-500"
            >
              Waktu Pengerjaan Ujian (menit)
            </label>
          </div>

          <section className="flex flex-col text-white">
            <h1 className="text-xl font-medium">
              Kelas yang Diuji
            </h1>
            <select required defaultValue="default" name="grade" className="p-1 text-neutral-900 outline-blue-500">
              <option disabled value="default">Pilih kelas</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          </section>
          
          <section>
            <h2 className="text-xl font-medium">Mata Pelajaran</h2>
            <select required defaultValue="default" name="subject" className="p-1 text-neutral-900 outline-blue-500">
              <option disabled value="default">Pilih mata pelajaran</option>
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

          <button type="submit" className="w-fit px-3 py-2 -mb-2 mx-auto rounded-2xl font-semibold border border-white hover:bg-white hover:text-emerald-900 transition-colors duration-150">
            Buat Ujian
          </button>
        </form>
      </div>
    </main>
  )
}
