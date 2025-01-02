import React from 'react'
import SideBar from './Sidebar'
import UserCard from '../Users/UsersCard'
import { BASE_BOARD_URL } from '../../Data/constants.js'
import { useQuery } from '@tanstack/react-query'
import {Notification, useNotification} from '../General/Notification/Notification'

function Index({db}) {
  const {
    data: currentUser,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['user', db.currentMemberId],
    queryFn: async () => {
        const response = await fetch(`${BASE_BOARD_URL}${db.board.id}/member/current`)
        return (await response.json())
    },
  })

  if(isError){
    return (
      <Notification name={"Error!"} message={error} type={"error"}/>
    )
  }
  
  return (
    <>
      <UserCard currentUser={currentUser} isLoading={isLoading}/>
      <h1>Board</h1>
    </>
  )
}

export default Index