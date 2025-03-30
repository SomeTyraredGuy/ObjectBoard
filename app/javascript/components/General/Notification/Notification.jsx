import React from 'react'
import classes from './Notification.module.css'
import { useEffect, useState } from 'react'

function Notification({type, title, message, timeOut = 5000, setVisible}) {
  function setType() {
    switch (type) {
      case "error":
        if (message === undefined || message === "") message = "Something went wrong"
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
      {title}
      {message !== undefined && <div className={`${classes.tooltiptext}`}>{message}</div>}
    </div>
  )
}

function useNotification(isError, ms = 5000, reloadPage = false) {
  const [errorVisible, setErrorVisible] = useState(false)

  useEffect(() => {
    if (isError) {
      setErrorVisible(true)
      setTimeout(() => {
        if (reloadPage) window.location.reload()
        else setErrorVisible(false)
      }, ms) 
    }
  }, [isError]);

  return errorVisible
}

export {Notification, useNotification}