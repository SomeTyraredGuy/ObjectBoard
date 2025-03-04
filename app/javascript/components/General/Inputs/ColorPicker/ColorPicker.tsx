import React, { useEffect, useState } from 'react'
import classes from './colorPicker.module.css'
import ColorCircle from './ColorCircle'
import inputClasses from '../input.module.css'

type Props = {
    value?: string,
    label: string,
    setColor: (color: string) => void,
}

function ColorPicker({label, setColor, value}: Props) {
  const colors = [
    "#000000",
    "#FFFFFF",
    "#5dbadc",
    "#63ab72",
    "#e94e1c",
    "transparent",
  ]
  const [selected, setSelected] = useState( 
    colors.findIndex((color) => color === value)
  )
  useEffect(() => {
    let index = colors.findIndex((color) => color === value)
    if (index === -1) index = colors.length
    setSelected( index )
  }, [value])
  

  return (
    <div >
        <p className={inputClasses.inputLabel}>{label}</p>

        <div className='d-flex align-items-center gap-2'>
          {
            colors.map((color, i) => (
              <ColorCircle 
                key={i} 
                color={color} 
                onClick={() => {
                  setSelected(i)
                  setColor(color)
                }}
                selected={selected === i}
              />
            ))
          }

          <input 
            type="color" 
            value={ /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) ? value : "#FFFFFF" }
            className={`${classes.colorPicker} ${selected === colors.length && classes.selected}`}
            onClick={() => {
              setSelected(colors.length)
            }}
            onInput={(e) => {
              const input = e.target as HTMLInputElement
              setColor(input.value)
            }}
          ></input>
        </div>
    </div>
  )
}

export default ColorPicker