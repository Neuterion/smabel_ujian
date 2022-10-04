import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  let { exam_id, prevQuestionCount } = req.body

  // Convert int to datetime object
  const createdAt = new Date(Date.now())

  // Update question count
  prevQuestionCount++

  const newQuestion = await prisma.question.create({
    data: {
      question: '',
      createdAt: createdAt,
      updatedAt: createdAt,
      examId: exam_id
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

  if (newQuestion) {
    return res.redirect(302, `/teacher/ujian/${exam_id}/${prevQuestionCount}/edit`)
  }
}