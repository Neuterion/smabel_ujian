import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(401).redirect('/')
  }

  // Get data submitted in request's body.
  const body = req.body
  
  // Create a new Pengumuman
  const pengumuman = await prisma.pengumuman.create({
    data: {
      title: body.title,
      description: body.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: author.id
    }
  })
}