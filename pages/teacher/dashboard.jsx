import { useSession, signOut } from "next-auth/react"

import Link from 'next/link'

import Dashboard from '../../components/dashboard'
import { TeacherProtection } from '../../components/protected'

export default function TeacherDashboard() {
  const { data: session } = useSession()
  return (
    <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
      <Dashboard session={session} signOut={signOut} title="115 | Dashboard">
        <div className='flex justify-around items-center text-sm font-medium'>
          <Link href=''>
            <a className='flex flex-auto justify-center text-white p-4 hover:text-gray-50'>
              Pengawas Ujian
            </a>
          </Link>
        </div>
      </Dashboard>
      <div>
        
      </div>
    </main>
  )
}

export const getServerSideProps = TeacherProtection