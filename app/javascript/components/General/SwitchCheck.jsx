import React from 'react'

function SwitchCheck({text, value, setValue, disabled = false}) {
  return (
    <div className="form-check form-switch">
        <input id={text} className="form-check-input" type="checkbox" role="switch" onChange={(event) => {setValue(event.target.checked)}} checked={value} disabled={disabled}/>
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{text}</label>
    </div>
  )
}

export default SwitchCheck