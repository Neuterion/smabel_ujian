import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  const { _question, opt_a, opt_b, opt_c, opt_d } = JSON.parse(req.body)

  // Convert update time to datetime object
  const updatedAt_to_datetime = new Date(_question.updatedAt)

  const question = await prisma.question.update({
    where: {
      id: _question.id
    },
    data: {
      question: _question.question,
      updatedAt: updatedAt_to_datetime
    }
  })

  const a = await prisma.choice.update({
    where: {
      id: opt_a.id
    },
    data: {
      choice: opt_a.choice,
      isCorrect: opt_a.isCorrect,
      updatedAt: updatedAt_to_datetime
    }
  })

  const b = await prisma.choice.update({
    where: {
      id: opt_b.id
    },
    data: {
      choice: opt_b.choice,
      isCorrect: opt_b.isCorrect,
      updatedAt: updatedAt_to_datetime
    }
  })

  const c = await prisma.choice.update({
    where: {
      id: opt_c.id
    },
    data: {
      choice: opt_c.choice,
      isCorrect: opt_c.isCorrect,
      updatedAt: updatedAt_to_datetime
    }
  })

  const d = await prisma.choice.update({
    where: {
      id: opt_d.id
    },
    data: {
      choice: opt_d.choice,
      isCorrect: opt_d.isCorrect,
      updatedAt: updatedAt_to_datetime
    }
  })
  console.log(question)

  if (question) {
    console.log("OK API")
    res.status(200).json({question, a, b, c, d})
    res.end()
    return
  }
  res.status(500)
  res.end()
}