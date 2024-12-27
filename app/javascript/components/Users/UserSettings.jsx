import React from 'react'
import ModalMenu from '../General/ModalMenu'
import classes from '../Board/board.module.css'

function UserSettings({toggleMenu}) {
    const buttons = [
        { name: 'Cancel', onClick: toggleMenu },
        { name: 'Save', onClick: toggleMenu }
    ]

  return (
    <ModalMenu buttons={buttons}>
        <h2 className='text-center'>Board member role</h2>
        <ul>
            
        </ul>
    </ModalMenu>
  )
}

export default UserSettings