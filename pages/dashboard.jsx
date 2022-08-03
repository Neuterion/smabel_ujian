import { getSession } from 'next-auth/react'

export default function RedirectToAssignedDashboard() {
  return <div>Redirecting...</div>
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  if (session.isTeacher) {
    return {
      redirect: {
        destination: '/teacher/dashboard',
        permanent: false,
      }
    }
  }
  else {
    return {
      redirect: {
        destination: '/student/dashboard',
        permanent: false,
      }
    }
  }
}
