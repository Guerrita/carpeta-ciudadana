'use client'
import React from "react";
import signUp from "@firebase/auth/signup"
import { useRouter } from 'next/navigation'
import axios from 'axios';

import { getAuth } from 'firebase/auth';
import firebase_app from '@firebase/config';
import Link from "next/link";
import addData from "@firebase/firestore/addData";


const auth = getAuth(firebase_app);

const strengthLabels = ["Invalid", "Medium", "Strong"];

function Page() {
    const [name, setName] = React.useState('')
    const [document, setDocument] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [strength, setStrength] = React.useState("");
    const router = useRouter()

    const apiGet = 'http://169.51.195.62:30174/apis/validateCitizen/'
    const apiPost = 'http://169.51.195.62:30174/apis/registerCitizen/'

    const registerUser = async (event) => {

        const response = await axios.get(apiGet + document, {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        })
        if (response.status === 204 && document.length >= 10) {
            //204 No content
            console.log(response.data)
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
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        console.log(`Email address ${email} already in use.`);
                        return;
                    case 'auth/invalid-email':
                        console.log(`Email address ${email} is invalid.`);
                        return;
                    case 'auth/operation-not-allowed':
                        console.log(`Error during sign up.`);
                        return;
                    case 'auth/weak-password':
                        console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
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
                        console.log(errorFirebase);
                    }
                    console.log(resultFirebase)
                    console.log(result)
                    return router.push("/")
                }

            }
        } else if (response.status === 200) {
            console.log(response.data)
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
    return (<div className="smash">
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
                <button onClick={registerUser} className="control">Registrarse</button>
            </div>
            <p>¿Ya tienes cuenta? <Link href="/signin">Inicia sesión</Link>
            </p>
        </div>
    </div>);
}

export default Page;