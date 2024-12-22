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
        }else{
            return toggleDropdown
        }
    }

    function noOtherUsers() {
        return otherUsers.length === 0
    }

  return (
    <button 
        className={`border-0 d-flex ${classes.buttonHover} ${noOtherUsers() && "justify-content-center align-items-center"}`} 
        style={{width: "60px"}} 
        onClick={buttonFunction()}
    >
        {!noOtherUsers() && 
            otherUsers.slice(0,3).map((user, index) => (
            <img className={`rounded-circle ${classes.avatarCard}`} key={user.email} src={`${user.avatar}`} alt='Current user avatar'/>
        ))}
        {noOtherUsers() &&
            <img src="https://www.freeiconspng.com/thumbs/plus-icon/plus-icon-black-2.png" alt="Add new user" style={{width: '42px', height: '42px'}} />
        }
    </button>
    
  )
}

export default OtherUsersButton