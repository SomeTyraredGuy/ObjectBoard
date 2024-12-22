import React from 'react'
import SideBar from './Sidebar'
import UserCard from './Users/UsersCard'

function Board({db}) {
  console.log(db)
  return (
    <>
        <UserCard members={db.members}/>
        <h1>Board</h1>
    </>
  )
}

export default Board