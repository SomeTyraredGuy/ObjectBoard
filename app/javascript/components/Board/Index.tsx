import React from 'react'
import UserCard from '../Users/UsersCard.jsx'
import { BASE_BOARD_URL } from '../../Data/constants.js'
import { useQuery } from '@tanstack/react-query'
import {Notification, useNotification} from '../General/Notification/Notification.jsx'
import ToolBar from './ToolBar/ToolBar.jsx'
import BoardMenu from './BoardMenu/BoardMenu.jsx'
import ResourcesMenu from './ResourcesMenu/ResourcesMenu.jsx'
import {useState} from 'react'
import {CanvasMode, CanvasState} from '../../Types/Canvas'
import Canvas from './Canvas/Canvas.js'

function Index({db}: {db: any}) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  })  

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
      <Notification name={"Error!"} message={error} type={"error"} setVisible={undefined}/>
    )
  }
  
  return (
    <>
      <Canvas
        canvasState={canvasState}
        setCanvasState={setCanvasState}
      />

      <BoardMenu board={db.board} isLoading={isLoading}/>
      <ToolBar 
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={() => {}}
        redo={() => {}}
        canUndo={false}
        canRedo={false}
      />

      <ResourcesMenu/>
      <UserCard currentUser={currentUser} isLoading={isLoading}/>
    </>
  )
}

export default Index