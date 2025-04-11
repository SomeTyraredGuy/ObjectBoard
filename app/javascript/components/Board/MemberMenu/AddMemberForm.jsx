import React from 'react'
import CenterMenu from '../../General/CenterMenu'
import classes from '../board.module.css'
import TextInput from '../../General/Inputs/TextInput/TextInput'
import useMemberUseMutation from '../../../hooks/Board/Members/UseMemberMutation'
import DefaultNotificationGroup from '../../General/Notification/DefaultNotificationGroup.js'


function AddMemberForm({closeFn, currentUser, refetchFn}) {
    const {
      mutate :add,
      error,
      isError,
      isSuccess,
      value : name,
      setValue : setName
    } = useMemberUseMutation({
      path: "add_to_board", 
      refetchFn: refetchFn, 
      defaultValue: "", 
      method: "POST"
    })

    const buttons = [
        { name: 'Close', onClick: closeFn },
        { name: 'Add', onClick: add, disabled: name === ""}
    ]

    return (
        <CenterMenu closeFn={closeFn} buttons={buttons} className={`${classes.maxwidthSmall} align-items-center`}>
            <h2 className='text-center m-3'>Add new member</h2>
            <TextInput name="Name" className="w-100" onChange={(event) => setName(event.target.value)}/>
            <DefaultNotificationGroup isError={isError} error={error} isSuccess={isSuccess}/>
        </CenterMenu>
    )
}

export default AddMemberForm