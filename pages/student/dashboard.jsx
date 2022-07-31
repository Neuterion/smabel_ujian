import { useSession, signOut } from "next-auth/react"

import Link from "next/link"

import Dashboard from '../../components/dashboard'

export default function Homepage() {
  const { data: session, status } = useSession()
  if (status === "authenticated") {
    return (
      <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
        <Dashboard session={session} signOut={signOut} title="115 | Dashboard">
          <div className='flex justify-around items-center text-sm font-medium'>
            <Link href=''>
              <a className='flex flex-auto justify-center text-white p-4 hover:text-gray-50'>
                Ujian Sekolah
              </a>
            </Link>
            <Link href='/pengumuman'>
              <a className='flex flex-auto justify-center text-white p-4 hover:text-gray-50'>
                Pengumuman Sekolah
              </a>
            </Link>
            <Link href=''>
              <a className='flex flex-auto justify-center text-white p-4 hover:text-gray-50'>
                Hasil Ujian
              </a>
            </Link>
          </div>
        </Dashboard>
      </main>
    )
  }
}
