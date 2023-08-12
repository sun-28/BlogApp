import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar';
import BlogContext from '../context/BlogContext';
import CreatePost from './CreatePost';
import Posts from './Posts';

export default function Blogs() {
  const context = useContext(BlogContext)
  const {getUser} = context;
  let navigate = useNavigate();
  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/login');
    }
    else{
      getUser();
    }
  }, [])
  return (
    <div className='Conn'>
      <Navbar/>
      <Posts/>
    </div>
  )
}
