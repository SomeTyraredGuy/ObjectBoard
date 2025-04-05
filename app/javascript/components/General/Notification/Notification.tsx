import React, { useRef } from 'react'
import classes from './Notification.module.css'
import generalClasses from '../general.module.css'
import { useEffect, useState } from 'react'

type Props = {
  type: "error" | "warning" | "success"
  title: string
  message?: string,
  trigger?: boolean
  ms?: number
  reloadPage?: boolean
}

function setType(type: "error" | "warning" | "success") {
  switch (type) {
    case "error":
      return classes.error

    case "warning":
      return classes.warning

    case "success":
      return classes.success

    default:
      return ""
  }
}

export default function Notification({type, title, message, trigger, ms = 5000, reloadPage = false}: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const hovered = useRef(false)
  const delayedInvisibility = useRef(false)
  const [slideOut, setSlideOut] = useState(false)

  function hide(){
    setSlideOut(true)
      setTimeout(() => {
        setSlideOut(false)

        if (hovered.current) {
          delayedInvisibility.current = true
          return
        }

        setIsVisible(false)
    }, 500)
  }

  useEffect(() => {
    if (trigger) {
      setIsVisible(true)
      
      setTimeout(() => {
        if (reloadPage) window.location.reload()
        else{
          if (hovered.current) {
            delayedInvisibility.current = true
            return
          }

          hide()
        } 
      }, ms)
    }
  }, [trigger])

  if (!isVisible && !hovered.current) return <></>

  return (
    <div className={reloadPage ? `${generalClasses.fullscreen} ${generalClasses.blur} ${generalClasses.zIndex100}` : ""}>
      <div 
        className={`${classes.tooltip} m-3 ${setType(type)} ${slideOut ? classes.slideOut : ""}`}
        onMouseEnter={() => {
          hovered.current = true
        }}
        onMouseLeave={() => {
          hovered.current = false
          if (delayedInvisibility.current) {
            delayedInvisibility.current = false
            hide()
          }
        }}
      >
        {title}
        {message !== undefined && <div className={`${classes.tooltiptext}`}>{message}</div>}
      </div>
    </div>
  )
}