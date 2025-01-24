import React from 'react'
import classes from './general.module.css'

function IconButton({icon: Icon, onClick, label, isDisabled, href}) {
  return (
    <div className={classes.hintWrapper}>
        <button 
            href={href}
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

export default IconButton