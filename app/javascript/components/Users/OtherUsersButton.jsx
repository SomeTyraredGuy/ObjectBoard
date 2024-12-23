import React from 'react'
import classes from '../board.module.css'
import { useState } from 'react'

function OtherUsersButton({otherUsers}) {
    const [dropdownState, setDropdownState] = useState(false)

    function toggleDropdown() {
        setDropdownState(!dropdownState)
    }

    function newMember() {
        console.log("new member")   
    }

    function buttonFunction() {
        if(noOtherUsers()){
            return newMember
        }
    }

    function noOtherUsers() {
        return otherUsers.length === 0
    }

  return (
    <div className="dropdown" >
        <button type="button" id="dropdownMenuButton1" data-bs-toggle={`${!noOtherUsers() && "dropdown"}`} aria-expanded="false"
        className={`min-w-100 border-0 d-flex ${classes.buttonHover} ${noOtherUsers() && "justify-content-center align-items-center"}`} 
        style={{width: "66px", height:"64px"}} 
        onClick={buttonFunction()}
        >
            {noOtherUsers() ? 
                <PlusCircle/> 
            : 
                otherUsers.slice(0,3).map((user, i) => (
                <img className={`rounded-circle ${classes.avatarCard}`} key={i} src={`${user.avatar}`} alt='Current user avatar'/>
            ))}
        </button>
        <ul className={`dropdown-menu p-0 ${classes.scroll}`} style={{width: "272px", maxHeight: "80vh"}} aria-labelledby="dropdownMenuButton1">
            {otherUsers.map( (user, i) =>     
                <li className={`d-flex flex-row justify-content-between align-items-center text-center border-bottom`} key={i}>
                    <img src={user.avatar} alt="Avatar" className="rounded-circle m-2" style={{width: '42px', height: '42px', minWidth: '42px'}}/>
                    <span className={`${classes.ellipsis}`} >{user.email}</span>
                    <a className="dropdown-item w-25" href="">
                        <span className='text-center'>Role:<br/>{user.role}</span>
                    </a>
                </li>
            )}
            <li>
                <a className="dropdown-item p-2 d-flex flex-row justify-content-between align-items-center" href="">
                    <PlusCircle/>
                    <span className='text-center flex-grow-1'>Add new member</span>
                </a>
            </li>            
        </ul>
    </div>
  )
}

function PlusCircle() {
    return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16" style={{width: '42px', height: '42px'}}>
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
    </svg>
    )
}

export default OtherUsersButton