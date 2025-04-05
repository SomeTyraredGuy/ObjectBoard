import React from 'react'
import classes from './slider.module.css'
import inputClasses from '../input.module.css'
import NumberInput from '../Number/NumberInput'

type Props = {
    min: number,
    max: number,
    value: number,
    multiple100?: boolean,
    step?: number,
    units?: string,
    label?: string,
    onChange: (value: number) => void,
}

function Slider({min, max, value, step = 1, multiple100 = false, units, label, onChange}: Props) {
  return (
    <div>
        {label && <p className={inputClasses.inputLabel} >{label}</p>}
        <div className='d-flex align-items-center gap-2'>
            <input 
                type="range" 
                step={step}
                min={min} 
                max={max} 
                value={value} 
                className={classes.rangeSlider}
                onChange={(e) => {
                    const input = e.target as HTMLInputElement
                    onChange( parseFloat(input.value) )
                }}
            />
            <NumberInput
                min={min}
                max={max}
                step={step}
                value={value}
                units={units}
                multiple100={multiple100}
                onChange={onChange}
            />
        </div>
    </div>
  )
}

export default Slider