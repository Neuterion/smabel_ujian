import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { getCsrfToken, getSession } from "next-auth/react"

import Background from '../../public/bg_school.webp'
import Logo from '../../public/logo.webp'

export default function SignIn({ csrfToken }) {
  const { error } = useRouter().query
  return (
    <main className='flex flex-auto flex-col items-center justify-center font-inter break-all xs:break-normal'>
      <Head>
        <title>115 | Login</title>
      </Head>
      <div className='-z-10'>
        <Image src={Background} alt="Background Image: 115 School Pic" layout='fill' objectFit='cover' objectPosition='center' />
      </div>
      <div className='w-11/12 xs:w-fit flex flex-col sm:flex-row items-center justify-center p-3 xs:p-6 bg-slate-100 rounded-lg'>
        <div className='w-[96px] xs:w-[128px] sm:w-[192px] mb-2 sm:mb-0'>
          <Image src={Logo} alt="Logo Smabel" layout='responsive' width={256} height={256} priority />
        </div>
        <div className='mx-0 xs:mx-4 flex flex-auto flex-col items-center justify-center'>
          {error && <SignInError error={error} />}
          <div className='text-2xl xs:text-4xl font-extrabold'>
            Welcome
          </div>
          <form method="post" action="/api/auth/callback/credentials" className='flex flex-col items-center justify-center'>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className='py-3 flex flex-col justify-center'>
              <input
                id='id_siswa' name='id' type='text' required pattern='\d{10}' title='ID harus berjumlah 10 angka.' placeholder='Your ID'
                className='font-medium my-1 w-11/12 xs:w-full px-3 py-2 rounded-md outline-0 border-2 border-gray-300 focus:border-gray-500'
              />
              <input
                id='password_siswa' name='password' type='password' required placeholder='Password'
                className='font-medium my-1 w-11/12 xs:w-full px-3 py-2 rounded-md outline-0 border-2 border-gray-300 focus:border-gray-500'
              />
              <Link href='/reset'>
                <a className='pl-1 text-xs underline'>
                  Lupa password?
                </a>
              </Link>
            </div>
            <div className='font-medium my-1'>
              <button type='submit' className='px-5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-800 text-slate-100 transition-colors duration-75'>
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

const errors = {
  CredentialsSignin: 'Sign in gagal. Cek kembali ID dan password Anda.',
  default: 'Sign in gagal.'
}

const SignInError = ({ error }) => {
  return (
    <div className='max-w-[25ch] rounded-lg p-2 mb-3 bg-blue-800 text-white text-center font-semibold'>
      {errors[error] || errors.default}
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
