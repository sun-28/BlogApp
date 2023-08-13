import React, { useContext, useEffect } from 'react'
import Navbar from './Navbar'
import UserPost from './UserPost'
import BlogContext from '../context/BlogContext';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import UsernameModal from './UsernameModal';
import PasswordModal from './PasswordModal';
export default function YourProfile(){
    const context = useContext(BlogContext)
    const {getUser,currUser} = context;
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem('token')){
          navigate('/login')
        }
        getUser();
    }, [])
  return (
    <div className='Conn'>
      <Navbar/>
      <div className='aldi'>
      {currUser && <div className='mainProfile'>
      <img className='profileImg' src={`data:image/svg+xml;base64,${currUser.Avatar}`} alt="img" />
      <button className='changeAva' onClick={() => navigate('/setavatar')} >Change Avater</button>
      <h2 className='username' ><span>Username : </span>{currUser.name}</h2>
      <h2 className='email' ><span>Email : </span>{currUser.email}</h2>
      <div style={{display: 'flex'}}>
      <button className='cUserDetails' data-bs-toggle="modal" data-bs-target="#exampleModal" >Change Username</button>
      
      <button className='cPass' data-bs-toggle="modal" data-bs-target="#passMo">Change Password</button>
      </div>
      </div>}
      <h2 className='UserPosts' style={{textAlign:'center'}} ><span>User Posts</span></h2>
      <UserPost/>
      </div>
      <UsernameModal/>
      <PasswordModal/>
    </div>
  )
}
