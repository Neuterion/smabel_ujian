import { prisma } from '../../../../lib/prisma'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Tiptap from '../../../../components/tiptap/tiptap'

export default ({ announcement }) => {
  const { data: session, status } = useSession()
  if (status === 'authenticated') {
    const router = useRouter()
    if (announcement.userId !== session.id) router.push(`/pengumuman/${announcement.id}`)
    return (
      <div>
        <Tiptap />
      </div>
    )
  }
}

export async function getStaticPaths() {
  const announcements = await prisma.announcement.findMany({
    select: {
      id: true
    }
  })
  return {
    paths: announcements.map((announcement) => ({
      params: { id: announcement.id.toString() }
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
