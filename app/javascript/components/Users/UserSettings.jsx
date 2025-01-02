import React from 'react'
import CenterMenu from '../General/CenterMenu'
import Selector from '../General/Selector'
import SwitchCheck from '../General/SwitchCheck'
import DefaultNotificationGroup from '../General/Notification/DefaultNotificationGroup'
import classes from '../Board/board.module.css'
import MemberUseMutation from './MemberUseMutation'

const roleDefaults = [
  { name: "Admin",
    can_edit: true,
    can_change_roles: true,
    can_assign_admin: false,
    can_ignore_rules: true
  },
  { name: "Editor",
    can_edit: true,
    can_change_roles: false,
    can_assign_admin: false,
    can_ignore_rules: false
  },
  { name: "Viewer",
    can_edit: false,
    can_change_roles: false,
    can_assign_admin: false,
    can_ignore_rules: false
  },
]

function UserSettings({currentUser, user, closeFn, refetchFn}) {
  const {
    mutate : save,
    error,
    isError,
    isSuccess,
    value : newRole,
    setValue : setNewRole
  } = MemberUseMutation({
    path: `update_role/${user.member_id}`,
    board_id: currentUser.board_id,
    refetchFn: refetchFn,
    defaultValue: user.role,
    method: "PATCH"
  })

  const buttons = [
    { name: 'Close', onClick: closeFn },
    { name: 'Save', onClick: save, disabled: changesIsDisabled() }
  ]
  const roleNames = [
    { name: "Owner", disabled: true},
    { name: "Admin", disabled: !currentUser.role.can_assign_admin},
    { name: "Editor", disabled: !currentUser.role.can_change_roles},
    { name: "Viewer", disabled: !currentUser.role.can_change_roles},
  ]

  function setNewRoleByName(newName){
    setNewRole({...newRole, ...roleDefaults.find(role => role.name === newName)})
  }

  function changesIsDisabled(){
    return !currentUser.role.can_change_roles || user.role.name === "Owner" || (user.role.name === "Admin" && !currentUser.role.can_assign_admin)
  }

  function adminChangesIsDisabled(){
    return newRole.name !== "Admin" || changesIsDisabled()
  }

  return (
    <CenterMenu buttons={buttons} closeFn={closeFn} className={`${classes.maxwidthSmall}`}>
        <h2 className='text-center m-3'>{user.name}</h2>
        <ul className='list-group'>
          <li className='list-group-item'>
            <Selector options={roleNames} currentOption={newRole.name} setOption={setNewRoleByName} disabled={changesIsDisabled()} className='d-flex justify-content-center'/>
          </li>
          <li className='list-group-item'>
            <SwitchCheck text={'Can edit'} value={newRole.can_edit} setValue={(value) => setNewRole({...newRole, can_edit: value})} disabled={true}/>
          </li>
          <li className='list-group-item'>
            <SwitchCheck text={'Can ignore rules'} value={newRole.can_ignore_rules} setValue={(value) => setNewRole({...newRole, can_ignore_rules: value})} disabled={true}/>
          </li>
          <li className='list-group-item'>
            <SwitchCheck text={'Can change roles'} value={newRole.can_change_roles} setValue={(value) => setNewRole({...newRole, can_change_roles: value, can_assign_admin: false})} disabled={adminChangesIsDisabled()}/>
          </li>
          <li className='list-group-item'>
            <SwitchCheck text={'Can assign admin'} value={newRole.can_assign_admin} setValue={(value) => setNewRole({...newRole, can_assign_admin: value})} disabled={adminChangesIsDisabled()}/>
          </li>
        </ul>
        <DefaultNotificationGroup isError={isError} error={error} isSuccess={isSuccess}/>
    </CenterMenu>
  )
}

export default UserSettings