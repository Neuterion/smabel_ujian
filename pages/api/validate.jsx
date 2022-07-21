import { prisma } from '../../lib/prisma'
import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(401).redirect('/')
  }

  // const SECRET = process.env.NEXTAUTH_SECRET
  // const token = await getToken({ req, SECRET })
  // console.log(token)

  // if (token.isAdmin) {
  //   return res.redirect('/you-are-admin')
  // }

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

  res.status(200).json(user)
}
