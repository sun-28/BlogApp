import React, { useState } from 'react'
import { useEffect } from 'react'
import BlogContext from '../context/BlogContext';
import { useContext } from 'react';
import format from 'date-fns/format';
import { useNavigate } from 'react-router-dom';
import {likeRoute, likesRoute } from '../utils/ApiRoutes';
const PostOut = ({blog}) => {
    const [dolike, setdolike] = useState(false)
    const [likes, setlikes] = useState(0)
    const like = async(id) => {
      const response  = await fetch(`${likeRoute}/${id}`,{
        method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
      });
      const json=await response.json();
      if(json.success){
        setlikes(json.likes)
        setdolike(json.like)
      }
    }

    const noOfLikes=async(id)=>{
        const response  = await fetch(`${likesRoute}/${id}`,{
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
        });
        const json=await response.json();
        if(json.success){
          setlikes(json.likes);
          setdolike(json.isLiked);
        }
      }

    useEffect(() => {
        noOfLikes(blog._id);
    }, [])
    const navigate = useNavigate()
  return (
    <div className='post'>
            <div className='imgDiv' onClick={() => navigate(`/post/${blog._id}`)}>
                < img className='postImg' src={`http://localhost:5000/${blog.cover}`} alt="IMAGE" />
            </div>
            <div className='contentDiv'  >
                <h2 className='postTitle' onClick={() => navigate(`/post/${blog._id}`)} >{blog.title}</h2>
                <div className='authTime' onClick={() => navigate(`/post/${blog._id}`)} >
                    <p className='postAuthor' >{blog.author.name}</p>
                    <p className='postTime' >{format(new Date(blog.updatedAt), 'MMM d, yyyy HH:mm')}</p>
                </div>
                <p className='postSummary' onClick={() => navigate(`/post/${blog._id}`)} >{blog.summary}</p>
                <button onClick={()=>like(blog._id)} className="lBtn" style={{ alignSelf: "flex-start", marginLeft: "-5px" }}>
                    <span className={`leftContainer ${dolike?"purp":""}`} >
                        <svg  fill={dolike?"purple":"#131324"} viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg>
                        <span className="like">Like</span>
                    </span>
                    <span className="likeCount">
                        {likes}
                    </span>
                </button>
            </div>
        </div>
  )
}

export default PostOut
