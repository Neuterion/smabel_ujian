import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const { id } = req.body

  // Deleting announcement by ID
  const announcement = await prisma.announcement.delete({
    where: {
      id: Number(id)
    }
  })

  if (announcement) return res.redirect(302, '/teacher/dashboard')
}