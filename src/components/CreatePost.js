import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from './Navbar'
import ReactQuill from 'react-quill'
import { useNavigate } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css'
import { postBlog } from '../utils/ApiRoutes'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export default function CreatePost(props) {
  const [title, settitle] = useState()
  const [summary, setsummary] = useState()
  const [content, setcontent] = useState('')
  const [file, setfile] = useState('')
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };
  let navigate = useNavigate();
  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  }, [])
  const toastoptions = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a Image !", toastoptions)
    }
    else {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('file', file[0]);
      data.append('token', localStorage.getItem('token'))
      const response = await fetch(postBlog, {
        method: 'POST',
        body: data
      })
      const json = await response.json();
      if (json.success) {
        navigate('/');
      }
      else {
        toast.error(json.error, toastoptions)
      }
    }
  }
  return (<div className='Conn'>
    <Navbar/>
    <form className='postForm' onSubmit={handleSubmit}>
      <input className='inp' type="text" placeholder='Title' value={title} onChange={(e) => { settitle(e.target.value) }} />
      <input className='inp' type="text" placeholder='Summary' value={summary} onChange={(e) => { setsummary(e.target.value) }} />
      <input className='fileinp' type="file" onChange={(e) => { setfile(e.target.files) }} />
      <ReactQuill value={content} modules={modules} onChange={(e) => { setcontent(e) }} />
      <button className='buttn' style={{ 'zIndex': "1" }} type="submit">Publish</button>
    </form>
    <ToastContainer />
  </div>
  )
}
