import React from 'react'
import inputClasses from '../input.module.css'

type Props = {
    min: number,
    max: number,
    step?: number,
    value: number,
    units?: string,
    multiple100?: boolean,
    onChange: (value: number) => void,
}

function NumberInput({min, max, step = 1, value, units, multiple100 = false, onChange}: Props) {
  const handleChange = (e) => {
    const input = e.target as HTMLInputElement
    let value = parseFloat(input.value)
    if( multiple100 ) value = value / 100
    if (value < min) value = min
    if (value > max) value = max
    onChange( value )
  }

  return (
    <div className='d-flex align-items-center gap-2'>
        <input 
          type="number" 
          min={multiple100 ? Math.round(min * 100) : min}
          max={multiple100 ? Math.round(max * 100) : max}
          step={multiple100 ? Math.round(step * 100) : step}
          value={multiple100 ? Math.round(value * 100) : value}
          onInput={handleChange}
          className='rounded fw-medium text-center'
          style={{width: '3.5rem'}}
        />
        {units && <p className={inputClasses.inputLabel}>{units}</p>}
    </div>
  )
}

export default NumberInput