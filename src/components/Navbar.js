import React from 'react'
import Logout from './Logout'
import Profile from './Profile'

export default function Navbar() {
  return (
    <nav>
        <div className='brand'>
            brand
        </div>
            <Profile/>
        <div className="profileOptions">
            <Logout/>
        </div>
    </nav>
  )
}
