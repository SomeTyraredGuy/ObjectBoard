import React from 'react'
import classes from '../Board/board.module.css'
import CurrentUser from './CurrentUserButton'
import OtherUsersButton from './OtherUsersButton'

function UsersCard({currentUser, isLoading}) {
  return (
    <table className={`position-fixed top-0 end-0 m-3 p-0 rounded border border-dark-subtle border-2 d-flex container ${classes.background} ${isLoading && "placeholder-wave"}`} style={{width: "280px", height: "70px"}}>
      {isLoading ? 
      <tbody className='placeholder col-12 bg-secondary'></tbody>
      :
      <tbody className='w-100'>
        <tr className='align-items-center d-flex justify-content-end'>
          <th className='border-end flex-grow-1'>
            <CurrentUser currentUser={currentUser}/>
          </th>
          <th className='flex-grow-1'>
            <OtherUsersButton currentUser={currentUser}/>
          </th>
        </tr>
      </tbody>}
    </table>
  )
}

export default UsersCard