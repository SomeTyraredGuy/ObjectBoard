import React from 'react'
import classes from './toolBar.module.css'
import {SelectSVG, UndoSVG, RedoSVG, TextSVG, RectangleSVG, CircleSVG, ArrowSVG} from '../../svg/ToolsSVG'
import IconButton from '../../General/IconButton'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'
import { CanvasObjectType } from '../../../Types/CanvasObjects'

interface ToolBarProps {
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean,
}

function ToolBar({canvasState, setCanvasState, undo, redo, canUndo, canRedo} : ToolBarProps) {
  const switchButtons = [
    {
      icon: SelectSVG,
      onClick: () => {setCanvasState({mode: CanvasMode.None})},
      label: "Select",
      isDisabled: false,
      isActive: canvasState.mode !== CanvasMode.Inserting
    },
    {
      icon: TextSVG,
      onClick: () => {setCanvasState({mode: CanvasMode.Inserting, objectType: CanvasObjectType.Text})},
      label: "Text",
      isDisabled: false,
      isActive: canvasState.mode === CanvasMode.Inserting &&
                canvasState.objectType === CanvasObjectType.Text
    },
    {
      icon: RectangleSVG,
      onClick: () => {setCanvasState({mode: CanvasMode.Inserting, objectType: CanvasObjectType.Rectangle})},
      label: "Rectangle",
      isDisabled: false,
      isActive: canvasState.mode === CanvasMode.Inserting &&
                canvasState.objectType === CanvasObjectType.Rectangle
    },
    {
      icon: CircleSVG,
      onClick: () => {setCanvasState({mode: CanvasMode.Inserting, objectType: CanvasObjectType.Circle})},
      label: "Circle",
      isDisabled: false,
      isActive: canvasState.mode === CanvasMode.Inserting &&
                canvasState.objectType === CanvasObjectType.Circle
    },
    {
      icon: ArrowSVG,
      onClick: () => {setCanvasState({mode: CanvasMode.Inserting, objectType: CanvasObjectType.Line})},
      label: "Line",
      isDisabled: false,
      isActive: canvasState.mode === CanvasMode.Inserting &&
                canvasState.objectType === CanvasObjectType.Line
    }
  ]
  
  const actionButtons = [
    {
      icon: UndoSVG,
      onClick: undo,
      label: "Undo",
      isDisabled: canUndo
    },
    {
      icon: RedoSVG,
      onClick: redo,
      label: "Redo",
      isDisabled: canRedo
    },
  ]

  return (
    <div className={`${classes.wrapper}`} role="group" aria-label="Vertical radio toggle button group">

      <div className={`${classes.section} border border-dark-subtle border-2`}>
          {switchButtons.map((button, i) => (
            <IconButton key={i} 
              icon={button.icon}
              onClick={button.onClick}
              label={button.label}
              isDisabled={button.isDisabled}
              isActive={button.isActive}
              href={null}
            />
          ))}
      </div>

      <div className={`${classes.section} border border-dark-subtle border-2`}>
          {actionButtons.map((button, i) => (
            <IconButton key={i} 
            icon={button.icon}
            onClick={button.onClick}
            label={button.label}
            isDisabled={button.isDisabled}
            isActive={null}
            href={null}
          />
          ))}
      </div>

    </div>
  )
}

export default ToolBar