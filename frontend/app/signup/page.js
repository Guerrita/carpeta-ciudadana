'use client'
import React from "react";
import signUp from "@firebase/auth/signup"
import { useRouter } from 'next/navigation'
import axios from 'axios';

import { getAuth } from 'firebase/auth';
import firebase_app from '@firebase/config';

const auth = getAuth(firebase_app);

const strengthLabels = ["Invalid", "Medium", "strong"];

function Page() {
    const [name, setName] = React.useState('')
    const [document, setDocument] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [strength, setStrength] = React.useState("");
    const router = useRouter()

    const [api, setApi] = React.useState('http://169.51.195.62:30174/apis/validateCitizen/')

    const registerUser = async (event) => {

        const response = await axios.get(api + document, {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        })
        if (response.status === 204) {
            //204 No content
            console.log(response.data)
            event.preventDefault()
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
            // //else successful
            console.log(result)
            return router.push("/")
        } else if (response.status === 200){
            console.log(response.data)
        }

        //The email is not registered




    }

    const getStrength = (password) => {
        let strengthIndicator = -1;


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
        <div className="">
            <h1 className="">Sign up</h1>
            <div className="aureole one smosh">


                <label htmlFor="name">Nombre
                </label>
                <input onChange={(e) => setName(e.target.value)} required type="text" name="name" id="name" placeholder="John Doe" />

                <label htmlFor="document">Documento
                </label>
                <input onChange={(e) => setDocument(e.target.value)} required type="number" name="document" id="document" placeholder="C.C" />
                <label htmlFor="email">Email
                </label>
                <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />

                <label htmlFor="password">Password
                </label>
                <input onChange={(e) => handleChange(e)} required type="password" name="password" id="password" placeholder="password" />
                <div className={`bars ${strength}`}>

                </div>
                <span className="strength ">{strength && <>{strength} password</>}</span>
                <button onClick={registerUser} className="button-fill">Sign up</button>
            </div>
        </div>
    </div>);
}

export default Page;