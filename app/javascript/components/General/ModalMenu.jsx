import React from 'react'
import classes from '../Board/board.module.css'

function ModalMenu({children, className, buttons}) {
  return (
    <div className={`d-flex justify-content-center align-items-center h-100 w-100 ${classes.fullscreen} ${classes.blur} ${classes.zIndex100}`}>
      <div className={`${classes.ModalMenu} ${classes.scroll} ${className}`}>
        {children}
        <div className='w-100 d-flex justify-content-end p-4 justify-content-around'>
          {buttons.map((button, i) => <a key={i} href='' onClick={button.onClick} className={`${classes.AButton}`}>{button.name}</a>)}
        </div>
      </div>
    </div>
  )
}

export default ModalMenu