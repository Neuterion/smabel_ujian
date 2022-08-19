import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const session = await unstable_getServerSession(req, res, authOptions)
  const createdAt = new Date()
  const body = req.body

  body.duration = Number(body.duration)
  body.grade = Number(body.grade)
  body.createdAt = createdAt
  body.updatedAt = createdAt
  body.userId = session.id
  
  const exam = await prisma.exam.create({
    data: body
  })

  if (exam) return res.status(200).redirect(`/teacher/ujian/${exam.id}/edit`)
}