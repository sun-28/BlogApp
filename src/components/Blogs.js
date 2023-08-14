import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar';
import BlogContext from '../context/BlogContext';
import CreatePost from './CreatePost';
import Posts from './Posts';
import loader from '../assets/loader.gif'

export default function Blogs() {
  const [load, setload] = useState(true)
  const context = useContext(BlogContext)
  const { getUser } = context;
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    else {
      getUser();
      setload(false)
    }
  }, [])
  return (
    load ? <div className="container">
      <img className="loader" src={loader} alt="loader" />
    </div> : <div className='Conn'>
              <Navbar />
              <Posts />
            </div>
  )
}
