import React from 'react'
import classes from '../Board/board.module.css'

function UserListItem({user, toggleMenu, disabledButton}) {
  return (
    <li className={`d-flex flex-row justify-content-between align-items-center text-center border-bottom`} key={user.user_id} >
        <img src={user.avatar} alt="Avatar" className="rounded-circle m-2" style={{width: '42px', height: '42px', minWidth: '42px'}}/>
        <span className={`${classes.ellipsis}`} >{user.name}</span>
        <button className="dropdown-item w-25" onClick={() => toggleMenu(user)} disabled={disabledButton} >
            <span className='text-center'>Role:<br/>{user.role.name}</span>
        </button>
    </li>
  )
}

export default UserListItem