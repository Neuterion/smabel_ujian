import { prisma } from '../../lib/prisma'
import { EditorContentStyles } from '../../components/tiptap/tiptap'

import Head from 'next/head'

export default ({ announcement }) => {
  return (
    <main className="p-4 cursor-default">
      <Head>
        <title>
          115 | {announcement.title}
        </title>
      </Head>
      <EditorContentStyles />
      <h1>
        {announcement.title}
      </h1>
      <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: announcement.content }}>
      </div>
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
  const announcement = await prisma.announcement.findUnique({
    where: {
      id: Number(params.id)
    }
  })
  return {
    props: {
      announcement: JSON.parse(JSON.stringify(announcement))
    }
  }
}
