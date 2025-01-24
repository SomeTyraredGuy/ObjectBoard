import React from 'react'
import classes from '../Board/board.module.css'
import PlusCircleSVG from '../svg/PlusCircleSVG.jsx'
import { useQuery } from '@tanstack/react-query'
import { BASE_BOARD_URL } from '../../Data/constants.js'
import { Notification, useNotification } from '../General/Notification/Notification'
import UserListItem from './UserListItem'
import UserSettings from './UserSettings'
import { useState } from 'react'
import AddUserForm from './AddUserForm.jsx'

function OtherUsersButton({currentUser}) {
    const [chosenUser, setChosenUser] = useState(null)
    const [showAddUserMenu, setShowAddUserMenu] = useState(false)
    
    function toggleUserMenu(user = null) {
        if(chosenUser === null && user !== null) setChosenUser(user)
        else setChosenUser(null)
    }

    function toggleAddUserMenu() {
        setShowAddUserMenu(!showAddUserMenu)
    }

    const {
        data: otherUsers,
        isError,
        error,
        refetch
      } = useQuery({
        queryKey: ['other_users'],
        queryFn: async () => {
            const response = await fetch(`${BASE_BOARD_URL}${currentUser.board_id}/member/others`)
            return (await response.json())
        }
    })

    function buttonFunction() {
        if(noOtherUsers()){
            return toggleAddUserMenu
        }
    }

    function noOtherUsers() {
        return otherUsers === undefined || otherUsers.length === 0
    }

    function buttonHover() {
        if ( !(!currentUser.role.can_change_roles && noOtherUsers()) ) return classes.buttonHover
        else return ""
    }

  return (
    <div className="dropdown" >
        <button type="button" id="dropdownMenuButton1" data-bs-toggle={`${!noOtherUsers() && "dropdown"}`} aria-expanded="false"
        className={`min-w-100 border-0 d-flex ${buttonHover()} ${noOtherUsers() && "justify-content-center align-items-center"}`} 
        style={{width: "66px", height:"64px"}} 
        onClick={buttonFunction()} disabled={!currentUser.role.can_change_roles && noOtherUsers()}
        >
            {noOtherUsers() ? 
                <PlusCircleSVG/> 
            : 
                otherUsers.slice(0,3).map((user, i) => (
                <img className={`rounded-circle ${classes.avatarCard}`} key={i} src={`${user.avatar}`} alt='Current user avatar'/>
            ))}
        </button>

        <ul className={`dropdown-menu p-0 ${classes.scroll}`} style={{width: "272px", maxHeight: "80vh"}} aria-labelledby="dropdownMenuButton1">
            {otherUsers !== undefined && otherUsers.map( (user, i) =>     
                <UserListItem user={user} toggleMenu={toggleUserMenu} key={i} disabledButton={!currentUser.role.can_change_roles}/>
            )}

            {currentUser.role.can_change_roles && 
                <li>
                    <a className="dropdown-item p-2 d-flex flex-row justify-content-between align-items-center" onClick={() => setShowAddUserMenu(!showAddUserMenu)}>
                        <PlusCircleSVG/>
                        <span className='text-center flex-grow-1'>Add new member</span>
                    </a>
                </li>
            }
        </ul>

        {useNotification(isError) && <Notification name={"Error fetching other users!"} message={error} type={"error"}/>}
        {chosenUser !== null && <UserSettings currentUser={currentUser} user={chosenUser} closeFn={toggleUserMenu} refetchFn={refetch}/>}
        {showAddUserMenu && <AddUserForm closeFn={toggleAddUserMenu} currentUser={currentUser} refetchFn={refetch}/>}
    </div>
  )
}

export default OtherUsersButton