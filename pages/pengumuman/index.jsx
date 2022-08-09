import Link from 'next/link'
import Head from 'next/head'

import { useRef } from 'react'

import { prisma } from '../../lib/prisma'
import { EditorContentStyles } from '../../components/tiptap/tiptap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default function AnnouncementsDisplay({ newestAnnouncements, mostPopularAnnouncements }) {
  const announcementRefs = {}
  return (
    <main className="flex-auto flex flex-col items-center bg-slate-100">
      <Head>
        <title>
          115 | Pengumuman
        </title>
      </Head>
      <EditorContentStyles />
      <div id="gridWrapper" className="w-full p-4 flex flex-col gap-y-7">
        <article>
          <h3 className="font-semibold font-inter mb-2">
            TERBARU
          </h3>
          <section className="w-full flex gap-x-6">
            {newestAnnouncements.map((announcement) => {
              announcementRefs[id] = useRef(clicks)
              return (
                <div key={announcement.id} className="flex flex-col bg-white p-6 rounded-lg drop-shadow-xl">
                  <Link href="/pengumuman/[id]" as={`/pengumuman/${announcement.id}`}>
                    <a target="_blank" onClick={async () => {
                        const { updatedClicks } = await fetch('/api/pengumuman/update-likes', {
                          method: 'POST',
                          body: JSON.stringify({
                            id: announcement.id,
                            clicks: announcement.clicks
                          })
                        })
                        announcementRefs[announcement.id].current = updatedClicks
                      }}
                      className="flex-auto font-inter text-3xl hover:underline"
                    >
                      <h1 className="text-4xl font-medium">
                        {announcement.title}
                      </h1>
                      <div dangerouslySetInnerHTML={{__html: announcement.content}} className="max-w-[20ch] text-base whitespace-normal break-all truncate" />
                    </a>
                  </Link>
                  <figure className="flex flex-col gap-y-3 bg-gradient-to-r from-green-500 to-lime-400 mt-4 -mx-6 -mb-6 p-3 cursor-default rounded-b-lg text-white/90">
                    <div className="flex items-center gap-x-3">
                      <FontAwesomeIcon icon={faUser} size="lg" />
                      <div>
                        <h3 className="font-semibold">
                          {announcement.author}
                        </h3>
                        {announcement.updatedAt !== announcement.createdAt ?
                          <h5 className="text-xs">
                            {announcement.updatedAt} (<i>{announcement.createdAt}</i>)
                          </h5>
                          :
                          <h5 className="text-xs">
                            {announcement.createdAt}
                          </h5>
                        }
                        <section className="text-xs">
                          {announcementRefs[announcement.id].current}x dibaca
                        </section>
                      </div>
                    </div>
                    <section className="flex gap-1 justify-evenly">
                      {announcement.audienceGrade.split('').map((grade) => (
                        <h5 key={announcement.id} className="bg-lime-50 px-2 py-1 rounded-xl text-xs text-lime-600">
                          #kelas{grade}
                        </h5>
                      ))}
                    </section>
                  </figure>
                </div>
              )
            })}
          </section>
        </article>
        <article>
          <h3 className="font-semibold font-inter mb-2">
            POPULER
          </h3>
          <section className="w-full flex gap-x-6">
            {mostPopularAnnouncements.map((announcement) => {
              announcementRefs[id] = useRef(clicks)
              return (
                <div key={announcement.id} className="flex flex-col bg-white p-6 rounded-lg drop-shadow-xl">
                  <Link href="/pengumuman/[id]" as={`/pengumuman/${announcement.id}`}>
                    <a target="_blank" onClick={async () => {
                        const { updatedClicks } = await fetch('/api/pengumuman/update-likes', {
                          method: 'POST',
                          body: JSON.stringify({
                            id: announcement.id,
                            clicks: announcement.clicks
                          })
                        })
                        announcementRefs[announcement.id].current = updatedClicks
                      }}
                      className="flex-auto font-inter text-3xl hover:underline"
                    >
                      <h1 className="text-4xl font-medium">
                        {announcement.title}
                      </h1>
                      <div dangerouslySetInnerHTML={{__html: announcement.content}} className="max-w-[20ch] text-base whitespace-normal break-all truncate" />
                    </a>
                  </Link>
                  <figure className="flex flex-col gap-y-3 bg-gradient-to-r from-green-500 to-lime-400 mt-4 -mx-6 -mb-6 p-3 cursor-default rounded-b-lg text-white/90">
                    <div className="flex items-center gap-x-3">
                      <FontAwesomeIcon icon={faUser} size="lg" />
                      <div>
                        <h3 className="font-semibold">
                          {announcement.author}
                        </h3>
                        {announcement.updatedAt !== announcement.createdAt ?
                          <h5 className="text-xs">
                            {announcement.updatedAt} (<i>{announcement.createdAt}</i>)
                          </h5>
                          :
                          <h5 className="text-xs">
                            {announcement.createdAt}
                          </h5>
                        }
                        <section className="text-xs">
                          {announcementRefs[announcement.id].current}x dibaca
                        </section>
                      </div>
                    </div>
                    <section className="flex gap-1 justify-evenly">
                      {announcement.audienceGrade.split('').map((grade) => (
                        <h5 key={announcement.id} className="bg-lime-50 px-2 py-1 rounded-xl text-xs text-lime-600">
                          #kelas{grade}
                        </h5>
                      ))}
                    </section>
                  </figure>
                </div>
              )
            })}
          </section>
        </article>
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const announcements = await prisma.announcement.findMany({
    include: {
      user: true
    }
  })

  const newestAnnouncements = [...announcements].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime()
    const dateB = new Date(b.updatedAt).getTime()
    return dateB - dateA
  })
  const mostPopularAnnouncements = [...announcements].sort((a, b) => {
    const popularityA = a.clicks
    const popularityB = b.clicks
    return popularityB - popularityA
  })

  const toLocaleStringOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  const tidyData = (announcement) => {
    announcement.author = announcement.user.gender === 'm' ? `Pak ${announcement.user.name}` : `Bu ${announcement.user.name}`
    if (announcement.content.length > 40) announcement.content = announcement.content.substring(0, 40) + '...'
    announcement.createdAt = new Date(announcement.createdAt).toLocaleString('id-ID', toLocaleStringOptions)
    announcement.updatedAt = new Date(announcement.updatedAt).toLocaleString('id-ID', toLocaleStringOptions)
  }
  
  // I only need to tidy data on one of the modified versions of announcements - the reason should be how the modified versions are a shallow copy -> [...announcements]
  newestAnnouncements.forEach((announcement) => tidyData(announcement))
  return {
    props: {
      newestAnnouncements: JSON.parse(JSON.stringify(newestAnnouncements)),
      mostPopularAnnouncements: JSON.parse(JSON.stringify(mostPopularAnnouncements))
    }
  }
}
