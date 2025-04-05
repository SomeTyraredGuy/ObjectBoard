import React from 'react'
import Notification from './Notification'

type Props = {
  isError: boolean
  error: Error
  isSuccess: boolean
}

function DefaultNotificationGroup({isError, error, isSuccess}: Props) {
  return (
    <>
    <Notification trigger={isError} title={error?.name} message={error?.message} type={"error"}/>
    <Notification trigger={isSuccess} title={"Success!"} type={"success"}/>
    </>
  )
}

export default DefaultNotificationGroup