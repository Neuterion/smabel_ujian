import { getSession } from 'next-auth/react'

export const TeacherProtection = async ({ req, res }) => {
  const session = await getSession({ req })
  if (!session.isTeacher) {
    return {
      redirect: {
        destination: '/student/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: { session }
  }
}

export const StudentProtection = async ({ req, res }) => {
  const session = await getSession({ req })
  if (session.isTeacher) {
    return {
      redirect: {
        destination: '/teacher/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: { session }
  }
}
