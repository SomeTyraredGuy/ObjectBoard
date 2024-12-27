import React from 'react'
import classes from '../Board/board.module.css'
import { useState } from 'react'
import PlusCircle from '../svg/PlusCircle'
import { useQuery } from '@tanstack/react-query'
import { BASE_URL } from '../../Data/constants.js'


function OtherUsersButton({boardId}) {
    const [dropdownState, setDropdownState] = useState(false)

    const {
        data: otherUsers,
        isLoading
      } = useQuery({
        queryKey: ['other_users'],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}boards/other_users/${boardId}`)
            return (await response.json())
        },
    })
    
    function toggleDropdown() {
        setDropdownState(!dropdownState)
    }

    function newMember() {
        console.log("new member") 
        console.log(otherUsers)  
    }

    function buttonFunction() {
        if(noOtherUsers()){
            return newMember
        }
    }

    function noOtherUsers() {
        return otherUsers === undefined || otherUsers.length === 0
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
            {otherUsers !== undefined && otherUsers.map( (user, i) =>     
                <li className={`d-flex flex-row justify-content-between align-items-center text-center border-bottom`} key={i}>
                    <img src={user.avatar} alt="Avatar" className="rounded-circle m-2" style={{width: '42px', height: '42px', minWidth: '42px'}}/>
                    <span className={`${classes.ellipsis}`} >{user.email}</span>
                    <a className="dropdown-item w-25" href="">
                        <span className='text-center'>Role:<br/>{user.role.name}</span>
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

export default OtherUsersButton