import { withAuth } from 'next-auth/middleware'

export default withAuth(
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/api')) return false
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
    '/api/:path*',
  ]
}