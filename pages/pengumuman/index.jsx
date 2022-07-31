import { prisma } from '../../lib/prisma'
import ContentStyles from '../../components/tiptap/styles/editor'

export default ({ announcements }) => {
  return (
    <main>
      <ContentStyles />
      {announcements.map((announcement) => {
        return (
          <div key={announcement.id}>
            <h1 className="text-3xl italic">
              {announcement.title}
            </h1>
            <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: announcement.content }}>
            </div>
          </div>
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
