import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  // Get data submitted in request's body.
  console.log(req)
  const body = req.body
  
  // Create a new Pengumuman
  const pengumuman = await prisma.announcement.update({
    where: {
      id: Number(body.id)
    },
    data: {
      title: body.title,
      content: body.content,
      updatedAt: new Date(body.editDate),
    }
  })
  if (pengumuman) return res.redirect(302, `/teacher/pengumuman/${body.id}/edit`)
}