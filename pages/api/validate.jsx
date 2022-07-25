import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(401).redirect('/')
  }

  // Get data submitted in request's body.
  const body = req.body

  const user = await prisma.user.findUnique({
    where: {
      id: body.id
    }
  })

  if (user === null || user.password !== body.password) {
    return res.status(400).json({ data: 'Invalid ID/password.' })
  }

  return res.status(200).json(user)
}
