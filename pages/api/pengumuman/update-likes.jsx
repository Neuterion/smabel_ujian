import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).redirect('/')

  let { id, clicks } = JSON.parse(req.body)
  clicks += 1
  await prisma.announcement.update({
    where: {
      id: id
    },
    data: {
      clicks: clicks
    }
  })

  return res.json({
    updatedClicks: clicks
  })
}