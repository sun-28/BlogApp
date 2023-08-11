import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlogContext from '../context/BlogContext';
import { UpdateBlogRoute } from '../utils/ApiRoutes';

export default function Post() {
    const {id} = useParams();
    const navigate = useNavigate();
    const context = useContext(BlogContext)
    const {getBlog,blogInfo,currUser,getUser} = context;
    useEffect(() => {
      getBlog(id);
      getUser();
    }, [])
    
  return (
    <div>
        {blogInfo && <h2>{blogInfo.Blog.title}</h2>}
        {blogInfo && blogInfo.Blog.author._id===currUser._id && <button onClick={() => navigate(`/updatepost/${id}`)} >Edit Post</button>}
    </div>
  )
}
