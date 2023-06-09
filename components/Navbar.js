import React from 'react'
import Link from 'next/link'
import logOut from "@firebase/auth/logout"
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter()

  const handleLogOut = async (event) => {
    event.preventDefault()
    const { result, error } = await logOut();
    if (error) {
      return console.log(error)
    }
    // else successful
    //console.log(result)
    return router.push("/signin")
  }
  return (
    <header className='mt13 mb13'>
    <nav className='nav-list mauto'>

      <Link href="/" passHref>
        <Image src="/carpeta.png" alt="carpeta" width={70} height={70} />
      </Link>

      <div>
        <button
          onClick={handleLogOut}
          className='button-fill'
          style={{margin: "auto"}}
        >
          Logout
        </button>
      </div>

    </nav>
    </header>
  )
}
