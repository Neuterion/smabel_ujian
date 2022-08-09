import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  // Get data submitted in request's body.
  // console.log(req)
  const body = JSON.parse(req.body)
  
  // Create a new Pengumuman
  const announcement = await prisma.announcement.update({
    where: {
      id: body.id
    },
    data: {
      title: body.title,
      content: body.content,
      updatedAt: new Date(body.editDate),
      audienceGrade: body.audienceGrade
    }
  })
  if (announcement) {
    res.status = 200
    res.end(JSON.stringify({
      updatedContent: announcement.content,
      updatedAudienceGrade: announcement.audienceGrade
    }))
  }
}