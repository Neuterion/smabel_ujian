import { withAuth } from 'next-auth/middleware'

export default withAuth(
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return !!token
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