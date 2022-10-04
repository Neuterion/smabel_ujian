import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const { id } = req.body

  const exam = await prisma.exam.delete({
    where: {
      id: id
    }
  })

  if (exam) {
    res.redirect(302, '/teacher/dashboard')
  }
}