import React from 'react'
import classes from '../board.module.css'
import IconButton from '../../General/IconButton'
import { UndoSVG } from '../../svg/ToolsSVG'

function BoardMenu({board}) {
  return (
    <div>
    <table className={`m-2 rounded border border-dark-subtle border-2 d-flex containers ${classes.background} ${false && "placeholder-wave"}`} style={{width: "280px"}}>
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
    </div>
  )
}

export default BoardMenu