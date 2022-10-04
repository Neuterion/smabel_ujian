import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const { type, id } = req.body
  let obj = null

  if (type === 'exam') {
    obj = await prisma.exam.delete({
      where: {
        id: id
      }
    })
  } else if (type === 'question') {
    obj = await prisma.question.delete({
      where: {
        id: id
      }
    })
  }

  if (obj) {
    return res.status(200).redirect('/teacher')
  }
}