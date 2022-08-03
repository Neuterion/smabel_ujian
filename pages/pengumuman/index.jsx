import Link from 'next/link'
import Head from 'next/head'

import { prisma } from '../../lib/prisma'
import { EditorContentStyles } from '../../components/tiptap/tiptap'

export default ({ announcements }) => {
  return (
    <main>
      <Head>
        <title>
          115 | Pengumuman
        </title>
      </Head>
      <EditorContentStyles />
      {announcements.map((announcement) => {
        return (
          <Link key={announcement.id} href="/pengumuman/[id]" as={`/pengumuman/${announcement.id}`}>
            <a target="_blank" className="text-3xl block italic">
              {announcement.title}
            </a>
          </Link>
        )
      })}
    </main>
  )
}

export async function getStaticProps() {
  const announcements = await prisma.announcement.findMany()

  return {
    props: {
      announcements: JSON.parse(JSON.stringify(announcements))
    }
  }
}
