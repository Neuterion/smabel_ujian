import { prisma } from '../../lib/prisma'
import { EditorContentStyles } from '../../components/tiptap/tiptap'

import Head from 'next/head'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faArrowPointer } from '@fortawesome/free-solid-svg-icons'

export default function AnnouncementDisplay({ announcement }) {
  const title = `115 | ${announcement.title}`
  return (
    <main className="flex-auto p-4 cursor-default bg-slate-100">
      <Head>
        <title>{title}</title>
      </Head>
      <EditorContentStyles />
      <article className="w-4/6 m-auto flex flex-col border border-slate-300 drop-shadow-md bg-white rounded-md p-6">
        <header className="bg-green-600 text-white/90 w-fit -ml-6 py-3 px-6 rounded-r-2xl">
          <figure>
            <FontAwesomeIcon icon={faUser} className="text-3xl mr-3" />
            <h3 className="text-3xl inline font-semibold underline decoration-lime-400">
              {announcement.author}
            </h3>
          </figure>
          <time className="text-sm">
            Diunggah pada {announcement.createdAt}
            { announcement.createdAt !== announcement.updatedAt
              ?
              <div className="inline">
                <span className="mx-1">
                  &bull;
                </span>
                Diedit pada {announcement.updatedAt}
              </div>
              :
              null
            }
          </time>
          {/* <section>
            <FontAwesomeIcon icon={faArrowPointer} className="text-lg" />
            {announcement.clicks}
          </section> */}
        </header>
        <main>
          <h1 className="text-7xl font-inter mt-7">
            {announcement.title}
          </h1>
          <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: announcement.content }}>
          </div>
        </main>
      </article>
    </main> 
  )
}

export async function getStaticPaths() {
  const announcements = await prisma.announcement.findMany({
    select: {
      id: true
    }
  })
  return {
    paths: announcements.map(({ id }) => ({
      params: { 
        id: id.toString() 
      }
    })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // Get announcement
  const announcement = await prisma.announcement.findUnique({
    where: {
      id: Number(params.id)
    },
    include: {
      user: true
    }
  })
  // Update amount of clicks
  // await prisma.announcement.update({
  //   where: {
  //     id: Number(params.id)
  //   },
  //   data: {
  //     clicks: announcement.clicks + 1
  //   }
  // })

  const toLocaleStringOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }

  announcement.author = announcement.user.gender === 'm' ? `Pak ${announcement.user.name}` : `Bu ${announcement.user.name}`
  announcement.createdAt = new Date(announcement.createdAt).toLocaleString('id-ID', toLocaleStringOptions)
  announcement.updatedAt = new Date(announcement.updatedAt).toLocaleString('id-ID', toLocaleStringOptions)
  return {
    props: {
      announcement: JSON.parse(JSON.stringify(announcement))
    }
  }
}
