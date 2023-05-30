'use client'
import React from "react";
import signUp from "@firebase/auth/signup"
import { useRouter } from 'next/navigation'
import axios from 'axios';


const strengthLabels = ["Invalid", "Medium", "strong"];

function Page() {
    const [name, setName] = React.useState('')
    const [document, setDocument] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [strength, setStrength] = React.useState("");
    const router = useRouter()
    
    const [api, setApi] = React.useState('http://169.51.195.62:30174/apis/validateCitizen/')

    const handleForm = async (event) => {

        event.preventDefault()
        const { result, error } = await signUp(email, password);
        if (error) {
            return console.log(error)
        }
        //else successful
        console.log(result)
        return router.push("/")
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
            <form onSubmit={handleForm} className="aureole one smosh">


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
                <button type="submit" className="button-fill">Sign up</button>
            </form>
        </div>
    </div>);
}

export default Page;