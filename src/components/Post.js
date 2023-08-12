import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlogContext from '../context/BlogContext';
import { UpdateBlogRoute } from '../utils/ApiRoutes';
import Navbar from './Navbar';
import format from 'date-fns/format';
export default function Post() {
    const {id} = useParams();
    // blogInfo && document.getElementsByClassName('ppostContent').inn = blogInfo.Blog.content ;
    const navigate = useNavigate();
    const context = useContext(BlogContext)
    const {getBlog,blogInfo,currUser,getUser} = context;
    useEffect(() => {
      getBlog(id);
      getUser();
    }, [])
    
  return (<div className='Conn'>
    <Navbar/>
    {blogInfo && <div className='ppost'>
        <h2 className='ppostTitle'>{blogInfo.Blog.title}</h2>
        <img height={100} className='ppostImg' src={`http://localhost:5000/${blogInfo.Blog.cover}`} alt="" />
        <div className='authLike'>
        <div className='ppostAuth'>
          <span className='ppostAuthor'>{blogInfo.Blog.author.name}</span>
          <span className='ppostDate'>{format(new Date(blogInfo.Blog.updatedAt), 'MMM d, yyyy HH:mm')}</span>
        </div>
          <div>
            <button>Like</button>
            <button>comment</button>
            {blogInfo.Blog.author._id===currUser._id && <button onClick={() => navigate(`/updatepost/${id}`)} >Edit Post</button>}
          </div>
        </div>
        <div className='ppostContent' dangerouslySetInnerHTML={{ __html: blogInfo.Blog.content }}>
        </div>
    </div>}
  </div>
  )
}
