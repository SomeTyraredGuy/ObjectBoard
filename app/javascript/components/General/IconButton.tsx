import React from 'react'
import classes from './general.module.css'
import { Side } from '../../Types/Canvas'

type Props = {
    icon: any,
    onClick?: () => void,
    label?: string,
    isDisabled?: boolean,
    isActive?: boolean,
    href?: string,
    side: Side
}

function IconButton({icon: Icon, onClick, label, isDisabled, isActive, href, side}: Props) {
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
    
    let sideClass
    switch (side) {
        case Side.Top:
            sideClass = classes.topHint
            break

        case Side.Bottom:
            sideClass = classes.bottomHint
            break

        case Side.Left:
            sideClass = classes.leftHint
            break

        case Side.Right:
            sideClass = classes.rightHint
            break
    }

  return (
    <div className={classes.hintWrapper}>
        {button}
        {label && <span className={`${classes.hint} ${sideClass}`}>
            {label}
        </span>}
    </div>
  )
}

export default IconButton