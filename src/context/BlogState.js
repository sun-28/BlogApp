import { useState } from "react";
import BlogContext from "./BlogContext";


import React from 'react'
import { BlogRoute, BlogsRoute, GetUser } from "../utils/ApiRoutes";

export default function NoteState({ children }) {
  const [currUser, setcurrUser] = useState(null)
  const [blogs, setblogs] = useState([])
  const [blogInfo, setblogInfo] = useState()
  const getUser = async () => {
    const response = await fetch(GetUser, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    })
    const user = await response.json();
    setcurrUser(user);
  }
  const getAllBlogs = async () =>{
    const response = await fetch(BlogsRoute);
    const json = await response.json();
    setblogs(json.blogs);
  }

  
  const getBlog = async (id) => {
    const response = await fetch(`${BlogRoute}/${id}`);
    const json = await response.json();
    setblogInfo(json);
  }
  
  const UpdateBlog = async () => { 
    const response = await fetch(BlogsRoute);
    const json = await response.json();
  } 

  return (
    <BlogContext.Provider value={{UpdateBlog,blogInfo,getBlog,blogs,getAllBlogs,currUser, setcurrUser, getUser }}>
      {children}
    </BlogContext.Provider>
  )
}
