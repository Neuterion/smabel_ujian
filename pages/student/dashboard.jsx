import { useSession } from "next-auth/react"

import Link from "next/link"

export default function Homepage() {
  const { data: session, status } = useSession()
  if (status === "authenticated") {
    return (
      <main className='flex flex-auto flex-col items-center font-inter break-all xs:break-normal'>
      </main>
    )
  }
}
