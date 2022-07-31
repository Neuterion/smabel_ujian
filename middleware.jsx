import { withAuth } from 'next-auth/middleware'

export default withAuth(
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false
        if (req.nextUrl.pathname.startsWith('/student/')) return !token.isTeacher
        if (req.nextUrl.pathname.startsWith('/teacher/')) return token.isTeacher

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/dashboard',
  ]
}