import { prisma } from '../../../lib/prisma'
import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  // Get data submitted in request's body.
  const body = req.body
  const { id } = await getToken({ req })

  const createDate = new Date(body.createDate)
  
  // Create a new Pengumuman
  const pengumuman = await prisma.announcement.create({
    data: {
      title: body.title,
      content: body.content,
      createdAt: createDate,
      updatedAt: createDate,
      userId: id
    }
  })

  if (pengumuman) return res.redirect(302, `/teacher/pengumuman/${pengumuman.id}/edit`)
}