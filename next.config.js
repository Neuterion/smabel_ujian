/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/student',
        destination: '/student/dashboard',
        permanent: false,
      },
      {
        source: '/teacher',
        destination: '/teacher/dashboard',
        permanent: false,
      }
    ]
  }
}

module.exports = nextConfig
