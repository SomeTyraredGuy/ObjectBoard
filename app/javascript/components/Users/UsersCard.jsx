import React from 'react'
import classes from '../Board/board.module.css'
import CurrentUser from './CurrentUserButton'
import OtherUsersButton from './OtherUsersButton'

function UsersCard({currentUser, isLoading}) {
  return (
    <table className={`m-2 position-fixed top-0 end-0 ${isLoading && "placeholder-wave"}`} style={{height: "70px"}}>
      {isLoading ? 
      <tbody className='placeholder col-12 bg-secondary'></tbody>
      :
      <tbody className='w-100'>
        <tr className='align-items-center d-flex justify-content-end'>
          <th className={`${classes.leftBorder} ${classes.leftRounded} ${classes.background}`} style={{width: "216px"}}>
            <CurrentUser currentUser={currentUser}/>
          </th>
          <th className={`${classes.rightBorder} ${classes.rightRounded} ${classes.background}`} style={{width: "64px"}}>
            <OtherUsersButton currentUser={currentUser}/>
          </th>
        </tr>
      </tbody>}
    </table>
  )
}

export default UsersCard