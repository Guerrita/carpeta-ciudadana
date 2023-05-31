'use client'
import React from "react";
import signIn from "../firebase/auth/signin";
import { useRouter } from 'next/navigation'
import Link from "next/link";

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()
        if (password.length < 6) {
            alert("Invalid password")
        }

        const { result, error } = await signIn(email, password);

        if (error) {
            console.log(error)
            alert("Invalid password")
            return
        }

        if (result) {
            // else successful
            console.log(result)
            return router.push("/")
        }
    }
    return (<div className="smash">
        <div className="auth-card">
            <h1 className="mb13">Inicia sesión</h1>
            <form onSubmit={handleForm} className="aureole one auth-form mt13">
                <label htmlFor="email">
                    Email
                </label>
                <input className="control" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="ejemplo@correo.com" />
                <label htmlFor="password">
                    Contraseña
                </label>
                <input  className="control" onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="contraseña" />
                <button type="submit" className="control">Iniciar sesión</button>
            </form>
            <p>¿Aún no tienes cuenta? <Link href="/signup">Regístrate</Link></p>
        </div>

    </div>);
}

export default Page;