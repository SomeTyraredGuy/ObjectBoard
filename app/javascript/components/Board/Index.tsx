import React, { useRef } from 'react'
import MemberMenu from './MemberMenu/MemberMenu.js'
import { getBaseURL } from '../../scripts/requestUtils.js'
import { useQuery } from '@tanstack/react-query'
import Notification from '../General/Notification/Notification.jsx'
import ToolBar from './ToolBar/ToolBar.jsx'
import BoardMenu from './BoardMenu/BoardMenu.jsx'
import ResourcesMenu from './ResourcesMenu/ResourcesMenu.jsx'
import {useState} from 'react'
import {CanvasMode, CanvasState} from '../../Types/Canvas'
import Canvas from './Canvas/Canvas.js'
import UseObjectsInteraction from '../../hooks/Board/Canvas/Objects/UseObjectsInteraction.js'
import UseStageScaleAndPosition from '../../hooks/Board/Canvas/UseStageScaleAndPosition.js'
import UseHistory from '../../hooks/Board/UseHistory.js'
import UseCanvasContentQuery from '../../hooks/Board/Canvas/UseCanvasContentQuery.js'
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
        const JSON = await fetch(`${ getBaseURL() }/member/current`)
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
  })

  const { 
      canvasObjects,
      setCanvasObjects,
      canvasUseObjectsInteraction,
      resourcesProperties
  } = UseObjectsInteraction({
    blocked: !currentUser?.role?.can_edit,
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
  } = UseCanvasContentQuery({setCanvasState, setCanvasObjects, isContentMutationError})

  const notifications = [
    {
      trigger: isCurrentUserError,
      message: currentUserError?.message,
      title: "Error loading user",
    },
    {
      trigger: isContentQueryError,
      message: contentQueryError?.message,
      title: "Error loading content",
    },
    {
      trigger: isContentMutationError,
      message: contentMutationError?.message,
      title: "Error saving content",
    }
  ]

  if( contentIsLoading || isUserLoading || !currentUser){
    return (
      <Loader/>
    )
  }
  
  return (
    <>
      <Canvas
        objectsBlocked={!currentUser?.role?.can_edit}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canvasObjects={canvasObjects}
        canvasUseObjects={canvasUseObjectsInteraction}
        canvasStageScaleAndPosition={useStageScaleAndPosition}
      />

      <BoardMenu
        showSaving={currentUser?.role?.can_edit}
        board={db.board} 
        unsavedChanges={unsavedChanges}
      />

      {currentUser?.role?.can_edit && 
      <>
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
      </>
      }

      <MemberMenu 
        currentUser={currentUser} 
      />

      {
        notifications.map((notification, index) => (
          <Notification
            key={index}
            trigger={notification.trigger}
            title={notification.title}
            message={notification.message}
            type={"error"}
            reloadPage={true}
          />
        ))
      }
    </>
  )
}

export default Index