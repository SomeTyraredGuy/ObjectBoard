import React from 'react'
import { useState } from 'react'
import classes from '../board.module.css'
import MemberSettings from './MemberSettings'

const options = [
    { name: 'Profile', href: '' },
    { name: 'My role', href: '' },
    { name: 'Leave Board', href: '' }
]

function CurrentMemberButton({currentUser}) {
  const [showMenu, setShowMenu] = useState(false)

  function toggleMenu() {
    setShowMenu(!showMenu)
  }
  
  return (
    <div>
        <button onClick={toggleMenu} className={`p-2 d-flex flex-row border-0 align-items-center w-100 ${classes.leftRounded} ${classes.buttonHover}`}>
            <img className='rounded-circle' src={`${currentUser.avatar}`} alt='Current user avatar' style={{width: '42px', height: '42px'}}/>
            <span className={`text-start mx-2 ${classes.ellipsis}`}><strong>{currentUser.name}</strong><br/>Role: {currentUser.role.name}</span>
        </button>
        {showMenu && <MemberSettings currentUser={currentUser} user={currentUser} closeFn={toggleMenu}/>}
  </div>
  )
}

export default CurrentMemberButton