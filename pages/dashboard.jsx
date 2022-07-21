import { useSession, getSession, signOut } from "next-auth/react"

import Link from "next/link"

import Dashboard from '../components/dashboard'

export default function Homepage() {
  const { data: session } = useSession()
  return (
    <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
      <Dashboard session={session} signOut={signOut}>
        <div className='flex justify-around items-center w-full shadow text-sm font-medium divide-x divide-gray-200 text-gray-500'>
          <Link href=''>
            <a className='flex flex-auto justify-center bg-white p-4 hover:bg-gray-50 hover:text-gray-700'>
              Ujian Sekolah
            </a>
          </Link>
          <Link href=''>
            <a className='flex flex-auto justify-center bg-white p-4 hover:bg-gray-50 hover:text-gray-700'>
              Pengumuman Sekolah
            </a>
          </Link>
          <Link href=''>
            <a className='flex flex-auto justify-center bg-white p-4 hover:bg-gray-50 hover:text-gray-700'>
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