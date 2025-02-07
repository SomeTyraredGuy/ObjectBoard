import React from 'react'
import classes from '../board.module.css'
import IconButton from '../../General/IconButton'
import { UndoSVG } from '../../svg/ToolsSVG'

function BoardMenu({board, isLoading}) {
  return (
    <table className={`m-2 position-fixed top-0 border border-dark-subtle border-2 ${classes.background} ${isLoading && "placeholder-wave"}`} style={{width: "280px"}}>
      {false ?
      <tbody className='placeholder col-12 bg-secondary'></tbody>
      :
      <tbody className='w-100'>
        <tr className='align-items-center d-flex justify-content-end'>
          <th className='border-end p-2'>
            <a href="/boards">
              <IconButton icon={UndoSVG} label={"Exit board"}/>
            </a>
          </th>
          <th className={`flex-grow-1 p-2 ${classes.ellipsis} text-center`}>
            {board.name}
          </th>
        </tr>
      </tbody>}
    </table>
  )
}

export default BoardMenu