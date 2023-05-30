import React from 'react'
import Link from 'next/link'
import logOut from "@firebase/auth/logout"
import { useAuthContext } from "@context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuthContext()
  const router = useRouter()

  const handleLogOut = async (event) => {
    event.preventDefault()
    const { result, error } = await logOut();
    if (error) {
        return console.log(error)
    }
    // else successful
    console.log(result)
    return router.push("/signin")
}
  return (
    <header>
        <Link href="/" passHref>
          Home
        </Link>
                {user ? (
              <div>
                <button
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </div>
):(console.log("goola"))}
    </header>
  )
}
