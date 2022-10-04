import { useSession, getSession } from "next-auth/react"

import Link from 'next/link'

import Navbar from '../../components/navbar'

import { prisma } from '../../lib/prisma'

export default function TeacherDashboard({ userAnnouncements: announcements, userExams: exams }) {
  const { status } = useSession()
  if (status === 'authenticated') {
    const datetimeToString = (datetime) => {
      const dividers = [60, 60, 24, 7, 3, 1]
      const timeTypes = [
        {timeType: 'detik', roundingType: (x) => Math.floor(x)}, 
        {timeType: 'menit', roundingType: (x) => Math.floor(x)}, 
        {timeType: 'jam', roundingType: (x) => Math.floor(x)}, 
        {timeType: 'hari', roundingType: (x) => Math.floor(x)}, 
        {timeType: 'minggu', roundingType: (x) => Math.round(x)}, 
        {timeType: 'minggu', roundingType: null}
      ]
      let difference = (Date.now() - new Date(datetime).getTime()) / 1000
      for (let i = 0; i < dividers.length; i++) {
        if (difference > dividers[i]) {
          if (i === dividers.length - 1) difference = `>3 ${timeTypes[i].timeType} yang lalu`
          else difference /= dividers[i]
        }
        else {
          difference = `${timeTypes[i].roundingType(difference)} ${timeTypes[i].timeType} yang lalu`
          break
        }
      }
      return difference
    }
    return (
      <>
        <Navbar />
        <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
          <div className="w-full flex-auto flex justify-center bg-gradient-to-t from-black/95 to-slate-900 text-white/90">
            <div className="w-full flex divide-x-2 divide-slate-800/50">
              <div id="ujian" className="w-1/2 flex flex-col p-4">
                <div className="flex justify-center gap-3 items-center text-2xl font-bold">
                  <h1>
                    Ujian Terkini
                  </h1>
                  <a href="/teacher/ujian/create" className="px-2 bg-blue-700 hover:bg-blue-800 rounded-full">
                    +
                  </a>
                </div>
                {exams.map(exam => (
                  <a href={`/teacher/ujian/${exam.id}/1/edit`} className="pointer-events-none flex justify-between items-center m-3 px-3 py-2 bg-slate-50 text-black/90 rounded-lg">
                    <h1 className="truncate w-1/2 text-lg pointer-events-auto px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white/95 font-bold rounded-md">
                      {exam.name}
                    </h1>
                    <time className="font-semibold">
                      {datetimeToString(exam.updatedAt)}
                    </time>
                  </a>
                ))}
              </div>
              <div id="pengumuman" className="w-1/2 flex flex-col p-4">
                <div className="flex justify-center gap-3 items-center text-2xl font-bold">
                  <h1>
                    Pengumuman Terkini
                  </h1>
                  <a href="/teacher/pengumuman/create" className="px-2 bg-blue-700 hover:bg-blue-800 rounded-full">
                    +
                  </a>
                </div>
                {announcements.map(announcement => (
                  <a href={`/teacher/pengumuman/${announcement.id}/edit`} className="pointer-events-none flex justify-between items-center m-3 px-3 py-2 bg-slate-50 text-black/90 rounded-lg">
                    <h1 className="truncate w-1/2 text-lg pointer-events-auto px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white/95 font-bold rounded-md">
                      {announcement.title}
                    </h1>
                    <time className="font-semibold">
                      {datetimeToString(announcement.updatedAt)}
                    </time>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req })
  const userAnnouncements = await prisma.announcement.findMany({
    where: {
      userId: session.id
    },
    orderBy: [
      {
        updatedAt: 'desc'
      }
    ]
  })
  const userExams = await prisma.exam.findMany({
    where: {
      userId: session.id
    },
    orderBy: [
      {
        updatedAt: 'desc'
      }
    ]
  })
  return {
    props: {
      userAnnouncements: JSON.parse(JSON.stringify(userAnnouncements)),
      userExams: JSON.parse(JSON.stringify(userExams))
    }
  }
}
