import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import BlogContext from '../context/BlogContext';
import { useContext } from 'react';
import format from 'date-fns/format';
import PostOut from './PostOut';
export default function Posts() {
    const context = useContext(BlogContext)
    const { getAllBlogs, blogs } = context;
    useEffect(() => {
        getAllBlogs();
    }, [])
    return (
        <div className='mainCon'>
            {blogs.length !== 0 && blogs.map((blog, index) => {
                return (
                    <PostOut key={index} blog={blog}/>
                )
            })
            }
        </div>
    )
}
