'use client'
import React from "react";
import signIn from "../firebase/auth/signin";
import { useRouter } from 'next/navigation'

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()
        if (password.length < 6){
            alert("Invalid password")
        }

        const { result, error } = await signIn(email, password);

        if (error) {
            console.log(error)
            alert("Invalid password")
            return 
        }

        // else successful
        console.log(result)
        return router.push("/")
    }
    return (<div className="">
        <div className="">
            <h1 className="">Sign in</h1>
            <form onSubmit={handleForm} className="form">
                <label htmlFor="email">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
                </label>
                <button type="submit">Sign in</button>
            </form>
        </div>

    </div>);
}

export default Page;