import React from 'react'
import CenterMenu from '../General/CenterMenu'
import classes from '../Board/board.module.css'
import TextInput from '../General/Inputs/TextInput/TextInput'
import MemberUseMutation from '../../hooks/Board/Members/UseMemberMutation'
import DefaultNotificationGroup from '../General/Notification/DefaultNotificationGroup.jsx'


function AddUserForm({closeFn, currentUser, refetchFn}) {
    const {
      mutate :add,
      error,
      isError,
      isSuccess,
      value : name,
      setValue : setName
    } = MemberUseMutation({
      path: "add_to_board", 
      board_id: currentUser.board_id, 
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

export default AddUserForm