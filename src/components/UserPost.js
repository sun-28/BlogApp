import React from 'react'
import blogContext from '../context/BlogContext'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post';
import { host } from '../utils/ApiRoutes'
import { format } from 'date-fns';
const UserPost = () => {
    const navigate = useNavigate();
    const context = useContext(blogContext);
    const { getBlogsById, userBlogs } = context;
    useEffect(() => {
        getBlogsById();
    }, [])

    return (
        <div className='post-con'>
            {
                userBlogs &&
                <div style={{marginTop:"2rem"}} className='mainCon '>
            {userBlogs.length !== 0?userBlogs.map((blog, index) => {
                return (
                    <div className='post' key={index} onClick={() => navigate(`/post/${blog._id}`)}>
                        <div className='imgDiv'>
                            < img className='postImg' src={`${host}/${blog.cover}`} alt="IMAGE" />
                        </div>
                        <div className='contentDiv' >
                            <h2 className='postTitle' >{blog.title}</h2>
                            <div style={{marginLeft:"-14px"}} className='authTime' >
                            <p className='postAuthor' >{blog.author.name}</p>
                            <p className='postTime' >{format(new Date(blog.updatedAt), 'MMM d, yyyy HH:mm')}</p>
                            </div>
                            <p className='postSummary' >{blog.summary}</p>
                        </div>
                    </div>
                )
            }):<h3 style={{color:"white",marginTop:"-2rem"}}>None</h3>
            }
        </div>
            }
        </div>
    )
}

export default UserPost
