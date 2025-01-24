import React from 'react'
import UserCard from '../Users/UsersCard'
import { BASE_BOARD_URL } from '../../Data/constants.js'
import { useQuery } from '@tanstack/react-query'
import {Notification, useNotification} from '../General/Notification/Notification'
import ToolBar from './ToolBar/ToolBar'
import BoardMenu from './BoardMenu/BoardMenu.jsx'
import ResourcesMenu from './ResourcesMenu/ResourcesMenu'

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

  if( useNotification(isError) ){
    return (
      <Notification name={"Error!"} message={error} type={"error"}/>
    )
  }
  
  return (
    <>
      <div className='position-fixed top-0 start-0 d-flex flex-column h-100'>
        <BoardMenu board={db.board}/>
        <ToolBar/>
      </div>

      <div className='position-fixed top-0 end-0 d-flex flex-column h-100'>
        <UserCard currentUser={currentUser} isLoading={isLoading}/>
        <ResourcesMenu/>
      </div>
      
      <h1>Board</h1>
    </>
  )
}

export default Index