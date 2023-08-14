import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlogContext from '../context/BlogContext';
import { DeleteRoute, UpdateBlogRoute, commentRoute, getAllCommentRoute, host, likeRoute, likesRoute } from '../utils/ApiRoutes';
import Navbar from './Navbar';
import format from 'date-fns/format';
import Comments from './Comments';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export default function Post() {
  const { id } = useParams();
  const ref = useRef(null)
  const executeScroll = () => ref.current.scrollIntoView()   
  const [dolike, setdolike] = useState(false)
  const [likes, setlikes] = useState(0);
  const [comments, setcomments] = useState([])
  const [comment, setcomment] = useState("")
  const toastoptions = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
}
  const handleDelete=async()=>{
    const response = await fetch(`${DeleteRoute}/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    }) 
    const json=await response.json();
    if(json.success){
      setTimeout(() => {
        navigate('/')
      }, 1500);
      toast.success("Post Deleted Successfully",toastoptions);
    }
    else{
      toast.error("Could not delete Post",toastoptions);
    }
  }
  const getAllComments = async () => {
    const response = await fetch(`${getAllCommentRoute}/${id}`);
    const json = await response.json();
    let arr = json.comms.reverse();
    setcomments(arr);
  }
  const commentOnPost = async () => {
    const response = await fetch(`${commentRoute}/${id}`,{
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        comment:comment
      })
    });
    const json = await response.json();
    setcomment("");
    if(json.success){
     getAllComments();     
    }
  }
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

      // blogInfo && document.getElementsByClassName('ppostContent').inn = blogInfo.Blog.content ;
      const navigate = useNavigate();
      const context = useContext(BlogContext)
      const { getBlog, blogInfo, currUser, getUser } = context;
      useEffect(() => {
        if(!localStorage.getItem('token')){
          navigate('/login')
        }
        getBlog(id);
        getUser();
        noOfLikes(id);
        getAllComments();
      }, [])
  return (<div className='Conn'>
    <Navbar />
    {blogInfo && <div className='ppost'>
      <h2 className='ppostTitle'>{blogInfo.Blog.title}</h2>
      <img height={100} className='ppostImg' src={`${host}/${blogInfo.Blog.cover}`} alt="" />
      <div className='authLike'>
        <div className='ppostAuth'>
          <span className='ppostAuthor'>{blogInfo.Blog.author.name}</span>
          <span className='ppostDate'>{format(new Date(blogInfo.Blog.updatedAt), 'MMM d, yyyy HH:mm')}</span>
        </div>
        <div className='btnns'>
          <button className="lBtn" onClick={()=>like(blogInfo.Blog._id)}>
            <span className={`leftContainer ${dolike?"purp":""}`}>
              <svg fill={dolike?"purple":"#131324"} viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg>
              <span className="like">Like</span>
            </span>
            <span className="likeCount">
              {likes}
            </span>
          </button>
          <button onClick={() => executeScroll()} className='commentt'>comment</button>
          {blogInfo.Blog.author._id === currUser._id && <button className='editt' onClick={() => navigate(`/updatepost/${id}`)} >Edit Post</button>}
          {blogInfo.Blog.author._id === currUser._id && <button className='editt' onClick={() => {handleDelete();}} >Delete Post</button>}
        </div>
      </div>
      <div className='ppostContent' dangerouslySetInnerHTML={{ __html: blogInfo.Blog.content }}>
      </div>
      <div ref={ref}></div>
    <Comments comments={comments} comment={comment} setcomment={setcomment} commentOnPost={commentOnPost} />
    <ToastContainer/>
    </div>}
  </div>
  )
}
