import { useSession, getSession, signOut } from "next-auth/react"

import Head from "next/head"
import Link from "next/link"

import Dashboard from '../components/dashboard'

export default function Homepage() {
  const { data: session } = useSession()
  return (
    <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
      <Dashboard session={session} signOut={signOut} title="115 | Dashboard">
        <div className='flex justify-around items-center text-sm font-medium'>
          <Link href=''>
            <a className='flex flex-auto justify-center text-white p-4 hover:text-gray-50'>
              Ujian Sekolah
            </a>
          </Link>
          <Link href=''>
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

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req })
  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    }
  } else if (session.isTeacher) {
    return {
      redirect: {
        destination: '/teacher/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: { session }
  }
}