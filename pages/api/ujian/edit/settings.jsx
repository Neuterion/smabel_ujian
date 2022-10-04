import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')
  const { id, data } = JSON.parse(req.body)

  const exam = await prisma.exam.update({
    where: {
      id: id
    },
    data: data
  })
  if (exam) {
    res.status(200).json(exam)
    res.end()
  }
}