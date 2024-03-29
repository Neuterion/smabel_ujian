import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const { id } = JSON.parse(req.body)

  // Deleting announcement by ID
  const announcement = await prisma.announcement.delete({
    where: {
      id: id
    }
  })

  if (announcement) {
    res.status = 200
    res.end()
  }
}