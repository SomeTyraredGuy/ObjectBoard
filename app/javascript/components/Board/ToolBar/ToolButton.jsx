import React from 'react'
import classes from '../board.module.css'

function ToolButton({icon: Icon, onClick, label, isDisabled}) {
  return (
    <div className={classes.hintWrapper}>
        <button 
            onClick={onClick}
            disabled={isDisabled}
            className={`btn btn-outline-primary p-2`}
        >
            <Icon width='24'/>
        </button>
        <span className={classes.rightHint}>
            {label}
        </span>
    </div>
  )
}

export default ToolButton