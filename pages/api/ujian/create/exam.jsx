import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const session = await unstable_getServerSession(req, res, authOptions)
  const createdAt = new Date()
  const body = JSON.parse(req.body)

  // Format data
  body.duration = Number(body.duration)
  body.grade = Number(body.grade)
  body.createdAt = createdAt
  body.updatedAt = createdAt
  body.userId = session.id
  
  // Create exam
  const exam = await prisma.exam.create({
    data: body
  })

  // Create question with four choices
  const newQuestion = await prisma.question.create({
    data: {
      question: '',
      createdAt: createdAt,
      updatedAt: createdAt,
      examId: exam.id
    }
  })

  for (let i = 0; i < 4; i++) {
    await prisma.choice.create({
      data: {
        choice: '', 
        isCorrect: false, 
        createdAt: createdAt, 
        updatedAt: createdAt, 
        questionId: newQuestion.id
      }
    })    
  }
  

  if (exam) {
    res.status(200).json({
      exam_id: exam.id
    })
  }
}