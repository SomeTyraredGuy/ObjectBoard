import React from 'react'
import {Notification, useNotification} from './Notification'

function DefaultNotificationGroup({isError, error, isSuccess}) {
  return (
    <>
    {useNotification(isError) && <Notification name={error.name} message={error.message} type={"error"}/>}
    {useNotification(isSuccess) && <Notification name={"Success!"} type={"success"}/>}
    </>
  )
}

export default DefaultNotificationGroup