import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import BlogContext from '../context/BlogContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';

export default function Posts() {
    const navigate = useNavigate();
    const context = useContext(BlogContext)
    const { getAllBlogs, blogs } = context;
    useEffect(() => {
        getAllBlogs();
    }, [])
    return (
        <div className='mainCon'>
            {blogs.length !== 0 && blogs.map((blog, index) => {
                return (
                    <div className='post' key={index} onClick={() => navigate(`/post/${blog._id}`)}>
                        <div className='imgDiv'>
                            < img className='postImg' src={`http://localhost:5000/${blog.cover}`} alt="IMAGE" />
                        </div>
                        <div className='contentDiv' >
                            <h2 className='postTitle' >{blog.title}</h2>
                            <div className='authTime' >
                            <p className='postAuthor' >{blog.author.name}</p>
                            <p className='postTime' >{format(new Date(blog.updatedAt), 'MMM d, yyyy HH:mm')}</p>
                            </div>
                            <p className='postSummary' >{blog.summary}</p>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}
