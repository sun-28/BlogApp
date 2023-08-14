import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { SignUpRoute } from '../utils/ApiRoutes';
import loader from '../assets/loader.gif'
export default function SignUp() {
const [load, setload] = useState(false)
    let navigate = useNavigate();
    const toastoptions = {
        position: "top-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }
    const [cred, setcred] = useState({ name: "", semail: "", spassword: "", repassword: "" })
    const onchange = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value });
    }
    const handlesubmit = async (e) => {
        setload(true)
        e.preventDefault();
        if (cred.spassword === cred.repassword) {

            const creds = { name: cred.name, email: cred.semail, password: cred.spassword }
            const response = await fetch(SignUpRoute,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(creds)
                }
            )
            const json = await response.json();
            if (json.success) {
                localStorage.setItem('token', json.authtoken)
                setload(false)
                navigate('/setAvatar');
            }
            else {
                setload(false)
                toast.error(json.error, toastoptions)
            }
        }
        else {
            setload(false)
            toast.error("Password Doesn't Match !", toastoptions)
        }
    }
    return (load?<div className="container">
    <img className="loader" src={loader} alt="loader" />
</div>:
        <div className='formContainer'>
            <div className="form" onSubmit={handlesubmit}>
                <div className='logo-wel'>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <div className="title" style={{textAlign:"center"}}>Welcome To Blogsy</div>
                        <div className="subtitle">Let's create your account!</div>
                    </div>
                </div>
                <div className="input-container ic1">
                    <input placeholder="Username" type="text" className="input" id="name" name='name' onChange={onchange} value={cred.name} />
                    <div className="cut"></div>
                    <label className="iLabel" htmlFor="username">Username</label>
                </div>

                <div className="input-container ic2">
                    <input placeholder="Email" type="email" className="input" name='semail' onChange={onchange} value={cred.semail} id="semail" />
                    <div className="cut"></div>
                    <label className="iLabel" htmlFor="lastname">Email</label>
                </div>
                <div className="input-container ic2">
                    <input placeholder="Password" type="password" className="input" name="spassword" onChange={onchange} value={cred.spassword} id="spassword" />
                    <div className="cut"></div>
                    <label className="iLabel" htmlFor="spassword">Password</label>
                </div>
                <div className="input-container ic2">
                    <input placeholder="Re-Password" type="password" className="input" name="repassword" onChange={onchange} value={cred.repassword} id="repassword" />
                    <div className="cut"></div>
                    <label className="iLabel" htmlFor="repassword">Re-Password</label>
                </div>
                <button onClick={handlesubmit} className="submit" type="text">Submit</button>
                <div className='Already'>
                    <span className="span">Already have an account? <Link to="/login">Sign In</Link></span>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
