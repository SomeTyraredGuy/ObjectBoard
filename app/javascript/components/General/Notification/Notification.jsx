import React from 'react'
import classes from './Notification.module.css'
import { useEffect, useState } from 'react'

function Notification({type, name, message, timeOut = 5000, setVisible}) {
  function setType() {
    switch (type) {
      case "error":
        if (message === undefined) message = "Something went wrong"
        return classes.error

      case "warning":
        return classes.warning

      case "success":
        return classes.success
    
      default:
        return "";
    }
  }

  if (setVisible !== undefined) setTimeout(() => {
    setVisible(false);
  }, timeOut);

  return (
    <div className={`${classes.tooltip} m-3 ${setType()}`}>
      {name}
      {message !== undefined && <div className={`${classes.tooltiptext}`}>{message}</div>}
    </div>
  )
}

function useNotification(isError, ms = 5000) {
  const [errorVisible, setErrorVisible] = useState(false)

  useEffect(() => {
    if (isError) {
      setErrorVisible(true)
      setTimeout(() => {
          setErrorVisible(false)
      }, ms) 
    }
  }, [isError]);

  return errorVisible
}

export {Notification, useNotification}