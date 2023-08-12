import React, { useContext, useEffect } from 'react'
import Navbar from './Navbar'
import UserPost from './UserPost'
import BlogContext from '../context/BlogContext';
import { useNavigate } from 'react-router-dom';
export default function YourProfile(){
    const context = useContext(BlogContext)
    const {getUser,currUser} = context;
    useEffect(() => {
        getUser();
    }, [])
    const navigate = useNavigate();
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
      <button className='cUserDetails'>Change User Details</button>
      <button className='cPass'>Change Password</button>
      </div>
      </div>}
      <h2 className='UserPosts' style={{textAlign:'center'}} ><span>User Posts</span></h2>
      <UserPost/>
      </div>
    </div>
  )
}
