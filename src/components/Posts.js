import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import BlogContext from '../context/BlogContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Posts() {
    const navigate = useNavigate();
    const context = useContext(BlogContext)
    const { getAllBlogs,blogs} = context;
    useEffect(() => {
        getAllBlogs();
    }, [])
    return (
        <>
        {blogs.length!==0 && blogs.map((blog,index)=>{
            return (
            <div key={index} onClick={()=>navigate(`/post/${blog._id}`)}>
            < img src = {`http://localhost:5000/${blog.cover}`} alt = "IMAGE" />
            <h2>{blog.title}</h2>
            <h4>{blog.author.name}</h4>
            <p>{blog.summary}</p>
            </div>    
            )
        })
        }
        </>
   )
}
