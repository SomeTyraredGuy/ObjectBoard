import React, { useRef } from 'react'
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
import UseObjectsInteraction from './Canvas/scripts/hooks/canvasObjectsHooks/UseObjectsInteraction.js'
import UseStageScaleAndPosition from './Canvas/scripts/hooks/UseStageScaleAndPosition.js'
import UseHistory from './Canvas/scripts/hooks/UseHistory.js'
import useCanvasContentQuery from './Canvas/scripts/hooks/useCanvasContentQuery.js'
import Loader from '../General/Loader/Loader.js'

function Index({db}: {db: any}) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  })  

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: currentUserError,
    isError: isCurrentUserError
  } = useQuery({
    queryKey: ['user', db.currentMemberId],
    queryFn: async () => {
        const JSON = await fetch(`${BASE_BOARD_URL}${db.board.id}/member/current`)
        const response = await JSON.json()
            
        if (!JSON.ok) {
          if (response.error) throw new Error(response.error)
          throw new Error()
        }
            
        return response
    },
  })

  const useStageScaleAndPosition = UseStageScaleAndPosition()
  const {
    stageScale
  } = useStageScaleAndPosition

  const changeObjects = useRef(() => {})

  const {
    historyHandleChanges,
    undo,
    canUndo,
    redo,
    canRedo,
    removeAdditionalDelay: removeAdditionalHistoryDelay,
    unsavedChanges,
    isContentMutationError,
    contentMutationError
  } = UseHistory({
    changeObjects,
    boardId: db.board.id,
  })

  const { 
      canvasObjects,
      setCanvasObjects,
      canvasUseObjectsInteraction,
      resourcesProperties
  } = UseObjectsInteraction({
    canvasState, 
    setCanvasState, 
    stageScale, 
    handleHistory: {
      changeObjects,
      historyHandleChanges,
      removeAdditionalHistoryDelay
    }
  })

  const {
    isLoading: contentIsLoading,
    error: contentQueryError,
    isError: isContentQueryError,
  } = useCanvasContentQuery({boardId: db.board.id, setCanvasState, setCanvasObjects, isContentMutationError})

  if( useNotification(isCurrentUserError || isContentQueryError || isContentMutationError, 5000, true) ){
    let message, title: string
    if (currentUserError){
      message = currentUserError.message
      title = "Error loading user"
    } else if (contentQueryError){
      message = contentQueryError.message
      title = "Error loading content"
    } else if (contentMutationError){
      message = contentMutationError.message
      title = "Error saving content"
    } else {
      message = "Unknown error"
      title = "Error"
    }

    return (
      <Notification 
        title={ title } 
        message={ message }
        type={"error"} 
        setVisible={undefined}
      />
    )
  }

  if( contentIsLoading || isUserLoading || !currentUser){
    return (
      <Loader/>
    )
  }
  
  return (
    <>
      <Canvas
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canvasObjects={canvasObjects}
        canvasUseObjects={canvasUseObjectsInteraction}
        canvasStageScaleAndPosition={useStageScaleAndPosition}
      />

      <BoardMenu 
        board={db.board} 
        unsavedChanges={unsavedChanges}
      />
      <ToolBar 
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={undo}
        redo={redo}
        canUndo={canUndo()}
        canRedo={canRedo()}
      />

      <ResourcesMenu
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        resourcesProperties={resourcesProperties}
      />
      <UserCard 
        currentUser={currentUser} 
      />
    </>
  )
}

export default Index