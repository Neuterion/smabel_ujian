import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  const question = await prisma.question.findUnique({
    where: {
      id: id
    }
  })

  if (question) {
    return res.status(200).json(question)
  }
}