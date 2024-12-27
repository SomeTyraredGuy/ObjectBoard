import React from 'react'
import SideBar from './Sidebar'
import UserCard from '../Users/UsersCard'
import { BASE_URL } from '../../Data/constants.js'
import { useQuery } from '@tanstack/react-query'

function Index({db}) {
  

  const {
    data: currentUser,
    isLoading
  } = useQuery({
    queryKey: ['user', db.currentMemberId],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}boards/user/${db.board.id}/${db.currentMemberId}`)
        return (await response.json())
    },
  })
  
  return (
    <>
      <UserCard currentUser={currentUser} isLoading={isLoading} boardId={db.board.id}/>
      <h1>Board</h1>
    </>
  )
}

export default Index