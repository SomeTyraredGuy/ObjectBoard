import React from 'react'
import classes from './toolBar.module.css'
import {SelectSVG, UndoSVG, RedoSVG, TextSVG, RectangleSVG, CircleSVG, ArrowSVG} from '../../svg/ToolsSVG'
import IconButton from '../../General/IconButton'
import { CanvasMode, CanvasState, Side } from '../../../Types/Canvas'
import { CanvasObjectType } from '../../../Types/CanvasObjects'
import UseDefaultObjects from '../Canvas/scripts/hooks/canvasObjectsHooks/UseDefaultObjects'

interface ToolBarProps {
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean,
}

function ToolBar({canvasState, setCanvasState, undo, redo, canUndo, canRedo} : ToolBarProps) {
  const { 
    defaultRectangle, 
    defaultEllipse, 
    defaultText, 
    defaultLine 
  } = UseDefaultObjects()

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
      onClick: () => {setCanvasState({
        mode: CanvasMode.Inserting, 
        objectType: CanvasObjectType.Text,
        startingProperties: defaultText()
      })},
      label: "Text",
      isDisabled: false,
      isActive: canvasState.mode === CanvasMode.Inserting &&
                canvasState.objectType === CanvasObjectType.Text
    },
    {
      icon: RectangleSVG,
      onClick: () => {setCanvasState({
        mode: CanvasMode.Inserting, 
        objectType: CanvasObjectType.Rectangle,
        startingProperties: defaultRectangle()
      })},
      label: "Rectangle",
      isDisabled: false,
      isActive: canvasState.mode === CanvasMode.Inserting &&
                canvasState.objectType === CanvasObjectType.Rectangle
    },
    {
      icon: CircleSVG,
      onClick: () => {setCanvasState({
        mode: CanvasMode.Inserting, 
        objectType: CanvasObjectType.Ellipse,
        startingProperties: defaultEllipse()
      })},
      label: "Ellipse",
      isDisabled: false,
      isActive: canvasState.mode === CanvasMode.Inserting &&
                canvasState.objectType === CanvasObjectType.Ellipse
    },
    {
      icon: ArrowSVG,
      onClick: () => {setCanvasState({
        mode: CanvasMode.Inserting, 
        objectType: CanvasObjectType.Line,
        startingProperties: defaultLine()
      })},
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

      <div className={`${classes.section}`}>
          {switchButtons.map((button, i) => (
            <IconButton key={i} 
              icon={button.icon}
              onClick={button.onClick}
              label={button.label}
              isDisabled={button.isDisabled}
              isActive={button.isActive}
              href={null}
              side={Side.Right}
            />
          ))}
      </div>

      <div className={`${classes.section}`}>
          {actionButtons.map((button, i) => (
            <IconButton key={i} 
            icon={button.icon}
            onClick={button.onClick}
            label={button.label}
            isDisabled={button.isDisabled}
            isActive={null}
            href={null}
            side={Side.Right}
          />
          ))}
      </div>

    </div>
  )
}

export default ToolBar