import { useSession, getSession, signOut } from "next-auth/react"

import { useState } from 'react'

import Head from 'next/head'
import Script from 'next/script'

import Dashboard from '../../components/dashboard'

export default function TeacherDashboard() {
  const { data: session } = useSession()
  return (
    <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
      <Dashboard session={session} signOut={signOut} title="115 | Dashboard">
        <div></div>
      </Dashboard>
    </main>
  )
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req })
  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    }
  } else if (!session.isTeacher) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: { session }
  }
}