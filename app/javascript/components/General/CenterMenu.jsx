import React from 'react'
import classes from '../Board/board.module.css'

function CenterMenu({children, className, buttons, closeFn}) {
  const backgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      closeFn();
    }
  };

  return (
    <div style={{position: "absolute"}}>
    <div className={`d-flex justify-content-center align-items-center ${classes.fullscreen} ${classes.blur} ${classes.zIndex100}`}
    onClick={backgroundClick}>
      <div className={`${classes.CenterMenu} ${classes.scroll} ${className}`}>
        {children}
        <div className='w-100 d-flex justify-content-end p-4 justify-content-around'>
          {buttons.map((button, i) => <button key={i} onClick={button.onClick} className={`btn btn-secondary p-2 pe-4 ps-4`} disabled={button.disabled}>{button.name}</button>)}
        </div>
      </div>
    </div>
    </div>
  )
}

export default CenterMenu