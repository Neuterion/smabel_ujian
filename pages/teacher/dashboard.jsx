import { useSession, getSession, signOut } from "next-auth/react"

import Dashboard from '../../components/dashboard'
import { TeacherProtection } from '../../components/protected'

export default function TeacherDashboard() {
  const { data: session } = useSession()
  return (
    <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
      <Dashboard session={session} signOut={signOut} title="115 | Dashboard">
        <div></div>
      </Dashboard>
    </main>
  )
}

export const getServerSideProps = TeacherProtection