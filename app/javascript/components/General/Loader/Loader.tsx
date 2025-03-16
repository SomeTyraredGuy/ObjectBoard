import React from 'react'
import classes from './loader.module.css'

function Loader() {
  return (
    <>
    <div className={classes.wrapper}>
        <div className='d-flex justify-content-center'>
        <div className={classes.loader}>
            <div className={classes.circle}></div>
            <div className={classes.circle}></div>
            <div className={classes.circle}></div>
            <div className={classes.circle}></div>
        </div>
        </div>

        <p className={classes.text}>Loading...</p>      
    </div>
    </>
  )
}

export default Loader