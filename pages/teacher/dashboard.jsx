import { useSession, getSession, signOut } from "next-auth/react"

import Link from 'next/link'

import { prisma } from '../../lib/prisma'

import Dashboard from '../../components/dashboard'

export default function TeacherDashboard({ userAnnouncements: announcements }) {
  const { data: session, status } = useSession()
  if (status === 'authenticated') {
    return (
      <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
        <Dashboard session={session} signOut={signOut} title="115 | Dashboard" />
        <div className="flex-auto w-full flex flex-row align-top divide-x-2 divide-green-500">
          <div id="pengumuman" className="flex-auto flex flex-col">
            <h1 className='flex flex-none justify-center p-4 bg-green-600 text-white font-bold drop-shadow-sm cursor-default'>
              Pengumuman Anda
            </h1>
            <Link href="/teacher/pengumuman/create" target="_blank">
              <a className="flex items-center p-3 mt-3 mx-auto gap-x-1.5 bg-cyan-400 hover:bg-cyan-500 text-white rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <h4 className="text-sm font-semibold">
                  Buat pengumuman baru
                </h4>
              </a>
            </Link>
            {announcements.map(announcement => (
              <Link href="/teacher/pengumuman/[id]/edit" as={`/teacher/pengumuman/${announcement.id}/edit`} key={announcement.id}>
                <a target="_blank">
                  <h1 className="text-3xl italic">
                    {announcement.title}
                  </h1>
                </a>
              </Link>
            ))}
          </div>
          <div id="ujian" className="flex-auto flex flex-col">
            <h1 className='flex flex-none justify-center p-4 bg-green-600 text-white font-bold drop-shadow-sm cursor-default -z-[1]'>
              Ujian Anda
            </h1>
            <button 
              className="flex items-center p-3 mt-3 mx-auto gap-x-1.5 bg-cyan-400 hover:bg-cyan-500 text-white rounded-md"
              onClick={() => window.open('/teacher/ujian/create', '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <h4 className="text-sm font-semibold">
                Buat ujian baru
              </h4>
            </button>
          </div>
        </div>
      </main>
    )
  }
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req })
  const userAnnouncements = await prisma.announcement.findMany({
    where: {
      userId: session.id
    }
  })
  return {
    props: {
      userAnnouncements: JSON.parse(JSON.stringify(userAnnouncements))
    }
  }
}
