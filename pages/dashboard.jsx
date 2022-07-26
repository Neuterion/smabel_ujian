import Router from 'next/router'
import { getSession, useSession } from 'next-auth/react'

export default () => {
  const { data: session } = useSession()
  if (session.isTeacher) {
    Router.push('/teacher/dashboard')
  }
  if (!session.isTeacher) {
    Router.push('/student/dashboard')
  }
  return <div>Redirecting...</div>
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  return {
    props: { session }
  }
}
