import React from 'react'
import classes from './toolBar.module.css'
import {SelectSVG, UndoSVG, RedoSVG} from '../../svg/ToolsSVG'
import IconButton from '../../General/IconButton'

function ToolBar({canvasState, setCanvasState, undo, redo, canUndo, canRedo}) {
  const switchButtons = [
    {
      icon: SelectSVG,
      onClick: () => {},
      label: "Select",
      isDisabled: false
    },
    {
      icon: SelectSVG,
      onClick: () => {},
      label: "Square",
      isDisabled: false
    },
    {
      icon: SelectSVG,
      onClick: () => {},
      label: "Circle",
      isDisabled: false
    },
    {
      icon: SelectSVG,
      onClick: () => {},
      label: "Triangle",
      isDisabled: false
    },
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
    <>
      <div className={`${classes.wrapper}`} role="group" aria-label="Vertical radio toggle button group">

        <div className={`${classes.section} border border-dark-subtle border-2`}>
            {switchButtons.map((button, i) => (
              <IconButton key={i} {...button}/>
            ))}
        </div>

        <div className={`${classes.section} border border-dark-subtle border-2`}>
            {actionButtons.map((button, i) => (
              <IconButton key={i} {...button}/>
            ))}
        </div>

      </div>
    </>
  )
}

export default ToolBar