import React, { useContext, useEffect, useState } from 'react'
import BlogContext from '../context/BlogContext';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
export default function UsernameModal() {
  const toastoptions = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
}
  const context = useContext(BlogContext)
    const {username,setUsername,password,setPassword,changeUsername} = context;
    const navigate = useNavigate();
    const change = async () => {
      const success = await changeUsername();
      if(success){
        toast.success('Username Successfully Changed',toastoptions)
        setTimeout(() => {
          window.location.reload(false);
        }, 1000);
      }
      else{
        toast.error('Cannot Verify User');
      }
    }
    const onchangeU = (e) => {
      setUsername(e.target.value)
    }
    const onchangeP = (e) => {
      setPassword(e.target.value);
    }
  return (
    <>
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Change Username</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="input-container ic2">
                <input placeholder="New Usename" type="text" value={username}  onChange={onchangeU} className="input" name='username' id="username" />
                <div className="cut"></div>
                <label className="iLabel" htmlFor="Username">Username</label>
              </div>
              <div className="input-container ic2">
                <input placeholder="Confirm password" type="password" value={password} onChange={onchangeP} className="input" name="password"  id="password" />
                <div className="cut"></div>
                <label className="iLabel" htmlFor="password">Password</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" onClick={()=>change()}>Update</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  )
}
