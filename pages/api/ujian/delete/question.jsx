import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const { id, order, exam_id } = req.body

  const question = await prisma.question.delete({
    where: {
      id: id
    }
  })

  if (question) {
    return res.redirect(302, `/teacher/ujian/${exam_id}/${order-1}/edit`)
  }
}