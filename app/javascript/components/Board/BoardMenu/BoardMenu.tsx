import React from 'react'
import classes from '../board.module.css'
import IconButton from '../../General/IconButton'
import { UndoSVG } from '../../svg/ToolsSVG'
import { Side } from '../../../Types/Canvas'

type Props = {
  board: {
    id: number,
    name: string,
    description: string,
  },
  isLoading: boolean
}

function BoardMenu({board, isLoading} : Props) {
  return (
    <table className={`m-2 position-fixed top-0 ${isLoading && "placeholder-wave"}`} style={{width: "280px"}}>
      {false ?
      <tbody className='placeholder col-12 bg-secondary'></tbody>
      :
      <tbody className='w-100'>
        <tr className='d-flex justify-content-end'>
          <th className={`${classes.leftBorder} ${classes.leftRounded} ${classes.background} p-2`}>
            <a href="/boards">
              <IconButton 
                icon={UndoSVG} 
                label={"Exit board"}
                side={Side.Right}
              />
            </a>
          </th>
          <th className={`flex-grow-1 p-2 ${classes.ellipsis} text-center align-content-center ${classes.rightBorder} ${classes.rightRounded} ${classes.background}`}>
            {board.name}
          </th>
        </tr>
      </tbody>}
    </table>
  )
}

export default BoardMenu