'use client'
import React from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { getAuth } from 'firebase/auth';
import signUp from "@firebase/auth/signup"
import firebase_app from '@firebase/config';
import addData from "@firebase/firestore/addData";
import axios from 'axios';

import ModalMessage from '@components/ModalMessage';
import Loader from '@components/Loader';


const auth = getAuth(firebase_app);

const strengthLabels = ["Invalid", "Medium", "Strong"];

function Page() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');

    const [name, setName] = React.useState('')
    const [document, setDocument] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const [strength, setStrength] = React.useState("");

    const router = useRouter()

    const apiGet = 'http://169.51.195.62:30174/apis/validateCitizen/'
    const apiPost = 'http://169.51.195.62:30174/apis/registerCitizen/'

    const openModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const registerUser = async (event) => {
        setIsLoading(true)
        if (document.length < 10) {
            setIsLoading(false)
            openModal("Formato de identificacion del Ciudadano no es valido debe ser de 10 digitos!")
            return
        }
        const response = await axios.get(apiGet + document, {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        })
        if (name.length === 0 || address.length === 0) {
            setIsLoading(false)
            openModal("Llena todos los datos")
            return
        }
        if (response.status === 204) {
            //204 No content
            event.preventDefault()
            const newUser = {
                "id": document,
                "name": name,
                "address": address,
                "email": email,
                "operatorId": 10001,
                "operatorName": "WOM"
            }
            const { result, error } = await signUp(email, password);

            if (error) {
                setIsLoading(false)
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        openModal(`La dirección de correo electronico ${email} ya está en uso.`);
                        return;
                    case 'auth/invalid-email':
                        openModal(`La dirección de correo electrónico ${email} no es válida.`);
                        return;
                    case 'auth/operation-not-allowed':
                        openModal(`Error durante el registro.`);
                        return;
                    case 'auth/weak-password':
                        openModal('La contraseña no es lo suficientemente segura. Debe tener mínimo 6 caracteres. Agregue caracteres adicionales, incluidos caracteres especiales y números.');
                        return;
                    default:
                        console.log(error.message);
                        return;
                }
            }
            // else successful
            if (result) {
                //TODO Add code to post a new client
                const newUserResponse = await axios.post(apiPost, newUser)
                if (newUserResponse.status == 201) {
                    const { resultFirebase, errorFirebase } = await addData('users', document, newUser)
                    if (errorFirebase) {
                        setIsLoading(false)
                        openModal(errorFirebase);
                        return
                    }
                    setIsLoading(false)
                    return router.push("/")
                }
            }
        } else if (response.status === 200) {
            setIsLoading(false)
            openModal(response.data)
        }
    }

    const getStrength = (password) => {
        let strengthIndicator = -1;
        if (password.length === 0) {
            strengthIndicator = -1
        }
        if (password.length <= 6) {
            strengthIndicator = 0
        }
        else if (password.length > 6 && password.length < 12) {
            strengthIndicator = 1
        }
        else {
            strengthIndicator = 2
        }
        setStrength(strengthLabels[strengthIndicator] ?? "");
    };

    const handleChange = (event) => {
        getStrength(event.target.value);
        setPassword(event.target.value)
    }


    return (
        <div className="smash">
            {isLoading ? <Loader /> :
                <div className=" auth-card">
                    <h1 className="mb13">Crea tu cuenta</h1>
                    <div className="aureole one auth-form mt13">
                        <label htmlFor="name">Nombre
                        </label>
                        <input className="control" onChange={(e) => setName(e.target.value)} required type="text" name="name" id="name" placeholder="John Doe" />
                        <label htmlFor="document">Documento
                        </label>
                        <input className="control" onChange={(e) => setDocument(e.target.value)} required type="number" name="document" id="document" placeholder="C.C" />
                        <label htmlFor="address">Dirección
                        </label>
                        <input className="control" onChange={(e) => setAddress(e.target.value)} required type="text" name="address" id="address" placeholder="Calle 7# 70-500" />
                        <label htmlFor="email">Email
                        </label>
                        <input className="control" onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="ejemplo@correo.com" />
                        <label htmlFor="password">Contraseña
                        </label>
                        <input className="control" onChange={(e) => handleChange(e)} required type="password" name="password" id="password" placeholder="contraseña" />
                        <div className={`bars ${strength}`}>
                            <div></div>
                        </div>
                        <span className={`strength ${strength}`}>{strength && <>{strength} password</>}</span>
                        <button onClick={e => { registerUser(e) }} className="button-fill">Registrarse</button>
                    </div>
                    <p>¿Ya tienes cuenta? <Link href="/signin">Inicia sesión</Link>
                    </p>
                </div>
            }
            {showModal && (
                <ModalMessage message={modalMessage} onClose={closeModal} />
            )}
        </div>);
}

export default Page;