import React from 'react'
import Logout from './Logout'

export default function Navbar() {
  return (
    <nav>
        <div className='brand'>
            brand
        </div>
        <div className="profileOptions">
            profile
            <Logout/>
        </div>
    </nav>
  )
}
