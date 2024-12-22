import React from 'react'
import classes from '../board.module.css'
import CurrentUser from './CurrentUserButton'
import OtherUsersButton from './OtherUsersButton'

function UsersCard({members}) {
  return (
    <table className={`position-fixed top-0 end-0 m-3 p-2 rounded border border-dark-subtle border-2 d-flex container ${classes.background}`} style={{width: "280px"}}>
      <tbody>
        <tr className='w-100 align-items-center d-flex justify-content-end'>
          <th className='border-end flex-grow-1'>
            <CurrentUser currentUser={members.current}/>
          </th>
          <th className=''>
            <OtherUsersButton otherUsers={members.others}/>
          </th>
        </tr>
      </tbody>
    </table>
  )
}

export default UsersCard