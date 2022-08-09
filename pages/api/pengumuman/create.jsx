import { prisma } from '../../../lib/prisma'
import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  // Get data submitted in request's body.
  const body = JSON.parse(req.body)
  const { id } = await getToken({ req })

  const createDate = new Date(body.createDate)
  
  // Create a new Pengumuman
  const announcement = await prisma.announcement.create({
    data: {
      title: body.title,
      content: body.content,
      createdAt: createDate,
      updatedAt: createDate,
      audienceGrade: body.audienceGrade,
      userId: id
    }
  })

  if (announcement) return res.end(JSON.stringify({
    announcementId: announcement.id
  }))
}