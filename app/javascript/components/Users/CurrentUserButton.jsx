import React from 'react'
import { useState } from 'react'
import classes from '../board.module.css'

const options = [
    { name: 'Profile', href: '' },
    { name: 'My role', href: '' },
    { name: 'Leave Board', href: '' }
]

function CurrentUser({currentUser}) {
  return (
    <div>
        <button className={`p-2 d-flex flex-row border-0 align-items-center ${classes.buttonHover}`} style={{width: "200px"}}>
            <img className='rounded-circle' src={`${currentUser.avatar}`} alt='Current user avatar' style={{width: '42px', height: '42px'}}/>
            <span className={`text-start mx-2 ${classes.ellipsis}`}><strong>{currentUser.email}</strong><br/>Role: {currentUser.role}</span>
        </button>
  </div>
  )
}

export default CurrentUser