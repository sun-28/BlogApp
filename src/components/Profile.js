import React, { useContext, useEffect } from 'react'
import BlogContext from '../context/BlogContext';
import { Link } from 'react-router-dom';

export default function Profile() {
    const context = useContext(BlogContext)
    const { currUser , getUser } = context;
    useEffect(() => {
        getUser()
    }, [])
    return (
        <div className="btn-group btn-profile">
            <button className="btn btn-secondary btn-lg dropdown-toggle btn-pro" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div className='pro'>
                <img src={currUser && `data:image/svg+xml;base64,${currUser.Avatar}`} alt="img" />
                <span>
                    {currUser && currUser.name}
                 </span>
                </div>
            </button >
            <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/">Home</Link></li>
                <li><Link className="dropdown-item" to="/profile">Your Profile</Link></li>
                <li><Link className="dropdown-item" to="/post">Create Post</Link></li>
            </ul>
        </div >)
}
