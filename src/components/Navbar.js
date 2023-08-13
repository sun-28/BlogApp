import React from 'react'
import Logout from './Logout'
import Profile from './Profile'

export default function Navbar() {
  return (
    <nav>
        <div className='brand'>
            Blogsy
        </div>
            <Profile/>
        <div className="profileOptions">
            <Logout/>
        </div>
    </nav>
  )
}
