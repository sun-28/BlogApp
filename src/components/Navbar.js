import React from 'react'
import Logout from './Logout'
import Profile from './Profile'

export default function Navbar() {
  return (
    <nav>
        <div className='brand'>
            brand
        </div>
        <div className="profileOptions">
            <Profile/>
            <Logout/>
        </div>
    </nav>
  )
}
