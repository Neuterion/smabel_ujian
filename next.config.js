/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: {
      allowFutureImage: true,
    }
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/student',
        destination: '/student/dashboard',
        permanent: true,
      },
      {
        source: '/teacher',
        destination: '/teacher/dashboard',
        permanent: true,
      }
    ]
  }
}

module.exports = nextConfig
