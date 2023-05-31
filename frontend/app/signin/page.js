'use client'
import React from "react";
import signIn from "../firebase/auth/signin";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import ModalMessage from '@components/ModalMessage';
import Loader from '@components/Loader';


function Page() {
    const [showModal, setShowModal] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const openModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleForm = async (event) => {
        setIsLoading(true)
        event.preventDefault()

        const { result, error } = await signIn(email, password);
        

        if (error) {
            openModal("Cuenta o contraseña erroneas.");
            setIsLoading(false)
            return
        }

        if (result) {
            // else successful
            console.log(result)
            return router.push("/")
        }
    }
    return (<div className="smash">
    {isLoading ? <Loader /> :
        <div className="auth-card">
            <h1 className="mb13">Inicia sesión</h1>
            <div className="aureole one auth-form mt13">
                <label htmlFor="email">
                    Email
                </label>
                <input className="control" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="ejemplo@correo.com" />
                <label htmlFor="password">
                    Contraseña
                </label>
                <input  className="control" onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="contraseña" />
                <button onClick={e=>{handleForm(e)}} className="control">Iniciar sesión</button>
            </div>
            <p>¿Aún no tienes cuenta? <Link href="/signup">Regístrate</Link></p>
        </div>
    }
    {showModal && (
        <ModalMessage message={modalMessage} onClose={closeModal} />
      )}
    </div>);
}

export default Page;