import React from 'react'
import classes from '../board.module.css'
import CurrentMemberButton from './CurrentMemberButton'
import OtherMembersButton from './OtherMembersButton'

type Props = {
  currentUser: any,
  isLoading?: boolean
}

function MemberMenu({currentUser, isLoading}: Props) {
  return (
    <table className={`m-2 position-fixed top-0 end-0 ${isLoading && "placeholder-wave"}`} style={{height: "70px"}}>
      {isLoading ? 
      <tbody className='placeholder col-12 bg-secondary'></tbody>
      :
      <tbody className='w-100'>
        <tr className='align-items-center d-flex justify-content-end'>
          <th className={`${classes.leftBorder} ${classes.leftRounded} ${classes.background}`} style={{width: "216px"}}>
            <CurrentMemberButton currentUser={currentUser}/>
          </th>
          <th className={`${classes.rightBorder} ${classes.rightRounded} ${classes.background}`} style={{width: "64px"}}>
            <OtherMembersButton currentUser={currentUser}/>
          </th>
        </tr>
      </tbody>}
    </table>
  )
}

export default MemberMenu