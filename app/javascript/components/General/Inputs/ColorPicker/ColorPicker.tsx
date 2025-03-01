import React, { useEffect, useState } from 'react'
import classes from './colorPicker.module.css'
import ColorCircle from './ColorCircle'

type Props = {
    initialValue?: string,
    label: string,
    setColor: (color: string) => void,
}

function ColorPicker({label, setColor, initialValue}: Props) {
  const colors = [
    "#000000",
    "#FFFFFF",
    "#5dbadc",
    "#63ab72",
    "#e94e1c",
    "transparent",
  ]
  const [selected, setSelected] = useState( 
    colors.findIndex((color) => color === initialValue)
  )
  useEffect(() => {
    setSelected( colors.findIndex((color) => color === initialValue) )
  }, [initialValue])
  

  return (
    <div >
        <p className='me-3 mb-0'>{label}</p>

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
            value={selected === colors.length ? initialValue : "#000000"}
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