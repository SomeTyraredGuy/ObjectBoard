import React from 'react'
import classes from './general.module.css'

type Props = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    onClick: () => void,
    label: string,
    isDisabled: boolean,
    isActive: boolean,
    href: string,
}

function IconButton({icon: Icon, onClick, label, isDisabled, isActive, href}: Props) {
  return (
    <div className={classes.hintWrapper}>
        <button 
            href={href}
            onClick={onClick}
            disabled={isDisabled}
            className={`btn btn-outline-primary shadow-none p-2 ${isActive ? 'active' : ''}`}
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