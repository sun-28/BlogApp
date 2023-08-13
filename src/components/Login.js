import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginRoute } from '../utils/ApiRoutes';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    let navigate = useNavigate();
    const toastoptions = {
        position: "top-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }
    const [cred, setcred] = useState({ email: "", password: "" })
    const onchange = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value });
    }
    const handlesubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(LoginRoute,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cred)
            }
        )
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            navigate('/');
        }
        else {
            toast.error(json.error, toastoptions)
        }
    }
    return (
        <div className='formContainer'>
            <div className="lform form" onSubmit={handlesubmit}>
                <div className='logo-wel'>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <div className="title">Welcome To Blogsy</div>
                        <div className="subtitle">Login To Continue</div>
                    </div>
                </div>
                <div className="input-container ic2">
                    <input placeholder="Email" type="email" className="input" name='email' onChange={onchange} value={cred.email} id="email" />
                    <div className="cut"></div>
                    <label className="iLabel" htmlFor="lastname">Email</label>
                </div>
                <div className="input-container ic2">
                    <input placeholder="Password" type="password" className="input" name="password" onChange={onchange} value={cred.password} id="password" />
                    <div className="cut"></div>
                    <label className="iLabel" htmlFor="spassword">Password</label>
                </div>
                <button onClick={handlesubmit} className="submit" type="submit">Submit</button>
                <div className='Already'>
                    <span className="span">Don't have an account? <Link to="/signup">Sign up</Link></span>
                    
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
