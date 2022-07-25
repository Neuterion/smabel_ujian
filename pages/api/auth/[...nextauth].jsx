import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '../../../lib/prisma'

export default NextAuth({
  adapters: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const res = await fetch('http://localhost:3000/api/validate', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const user = await res.json()

        if (res.ok && user) {
          console.log(user)
          return user
        }
        return null
      }
    })
  ],
  callbacks: {
    // signIn: async (user, account, profile, session, token, req, res) => {
    //   const { isTeacher } = user
    //   if (isTeacher) {
    //     return {
    //       redirect: {
    //         destination: '/teacher/dashboard',
    //         permanent: false,
    //       }
    //     }
    //   }
    //   return {
    //     redirect: {
    //       destination: '/dashboard',
    //       permanent: false,
    //     }
    //   }
    // },
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user) {
        token.isTeacher = user.isTeacher
      }
      return token
    },
    session: async ({ session, token, user }) => {
      // Send properties to the client, like an access_token from a provider.
      if (token) {
        session.isTeacher = token.isTeacher
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/sign-in'
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60
  }
})