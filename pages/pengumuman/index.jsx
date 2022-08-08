import Link from 'next/link'
import Head from 'next/head'

import { useRef } from 'react'

import { prisma } from '../../lib/prisma'
import { EditorContentStyles } from '../../components/tiptap/tiptap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default function AnnouncementsDisplay({ announcements }) {
  return (
    <main className="flex-auto flex flex-col items-center bg-slate-100">
      <Head>
        <title>
          115 | Pengumuman
        </title>
      </Head>
      <EditorContentStyles />
      <div id="gridWrapper" className="w-full p-4">
        <h3 className="font-semibold font-inter mb-2">
          TERBARU
        </h3>
        <section className="w-full flex gap-x-6">
          {announcements.map((announcement) => (
              <div key={announcement.id} className="flex flex-col bg-white p-6 rounded-lg drop-shadow-xl">
                <Link href="/pengumuman/[id]" as={`/pengumuman/${announcement.id}`}>
                  <a target="_blank" className="flex-auto font-inter text-3xl hover:underline">
                    <h1 className="text-4xl font-medium">
                      {announcement.title}
                    </h1>
                    <div dangerouslySetInnerHTML={{__html: announcement.content}} className="max-w-[20ch] text-base whitespace-normal break-all truncate" />
                  </a>
                </Link>
                <figure className="flex items-center gap-x-3 bg-gradient-to-r from-green-500 to-lime-400 mt-4 -mx-6 -mb-6 p-3 cursor-default rounded-b-lg text-white/90">
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
                  </div>
                </figure>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const announcements = await prisma.announcement.findMany({
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      user: true
    }
  })

  const toLocaleStringOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  
  announcements.forEach((announcement) => {
    announcement.author = announcement.user.gender === 'm' ? `Pak ${announcement.user.name}` : `Bu ${announcement.user.name}`
    if (announcement.content.length > 40) announcement.content = announcement.content.substring(0, 40) + '...'
    announcement.createdAt = new Date(announcement.createdAt).toLocaleString('id-ID', toLocaleStringOptions)
    announcement.updatedAt = new Date(announcement.updatedAt).toLocaleString('id-ID', toLocaleStringOptions)
  })
  return {
    props: {
      announcements: JSON.parse(JSON.stringify(announcements))
    }
  }
}
