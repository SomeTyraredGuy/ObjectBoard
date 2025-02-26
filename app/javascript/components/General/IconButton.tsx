import React from 'react'
import classes from './general.module.css'

type Props = {
    icon: any,
    onClick?: () => void,
    label?: string,
    isDisabled?: boolean,
    isActive?: boolean,
    href?: string,
}

function IconButton({icon: Icon, onClick, label, isDisabled, isActive, href}: Props) {
    const button = onClick ? (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`btn btn-outline-primary shadow-none p-2 ${isActive ? 'active' : ''}`}
        >
            <Icon width='24'/>
        </button>
    ) : (
        <a
            href={href}
            className={`btn btn-outline-primary shadow-none p-2 ${isActive ? 'active' : ''}`}
        >
            <Icon width='24'/>
        </a>
    )

  return (
    <div className={classes.hintWrapper}>
        {button}
        {label && <span className={classes.rightHint}>
            {label}
        </span>}
    </div>
  )
}

export default IconButton