import { useState } from "react";
import BlogContext from "./BlogContext";
import React from 'react'
import { BlogRoute, BlogsByIdRoute, BlogsRoute, GetUser, changeName, changePass, isLiked } from "../utils/ApiRoutes";


export default function NoteState({ children }) {
  const [currUser, setcurrUser] = useState(null)
  const [userBlogs, setUserBlogs] = useState()
  const [blogs, setblogs] = useState([])
  const [blogInfo, setblogInfo] = useState()
  const [username, setUsername] = useState()
  const [npassword, setNpassword] = useState()
  const [password, setPassword] = useState()
  

  const changeUsername = async () => {
     const response  = await fetch(changeName,{
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        'newName': username,
        'pass': password
      })
     })
     const json = await response.json();
     if(json.success){
        return true;
     }
     else{
        return false;
     }
  }

  const changePassword = async () => {
     const response  = await fetch(changePass,{
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        'oldPass': password,
        'NewPass': npassword
      })
     })
     const json = await response.json();
     if(json.success){
        return true;
     }
     else{
        return false;
     }
  }


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

  const getBlogsById = async () =>{
    const response = await fetch(BlogsByIdRoute,{
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    })
    const json = await response.json();
    setUserBlogs(json.Blog); 

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
    <BlogContext.Provider value={{npassword,setNpassword,changePassword,username,setUsername,password,setPassword,changeUsername,userBlogs,getBlogsById,UpdateBlog,blogInfo,getBlog,blogs,getAllBlogs,currUser, setcurrUser, getUser }}>
      {children}
    </BlogContext.Provider>
  )
}
