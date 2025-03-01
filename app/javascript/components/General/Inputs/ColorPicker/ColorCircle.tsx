import React from 'react'
import classes from './colorPicker.module.css'

type Props = {
    color: string,
    onClick: () => void,
    selected: boolean,
}

function ColorCircle({color, onClick, selected}: Props) {
  return (
    <div data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"
        className={`${classes.colorCircle} ${color === "transparent" && classes.transparentCircle} ${selected && classes.selected}`}
        onClick={onClick}
        style={{backgroundColor: color}}
    ></div>
  )
}

export default ColorCircle