import React from 'react'
import classes from '../board.module.css'
import generalClasses from '../../General/general.module.css'
import IconButton from '../../General/IconButton'
import { UndoSVG } from '../../svg/ToolsSVG'
import { Side } from '../../../Types/Canvas'
import CheckSVG from '../../svg/CheckSVG'

type Props = {
  board: {
    id: number,
    name: string,
    description: string,
  },
  isLoading: boolean,
  unsavedChanges: boolean
}

function BoardMenu({board, isLoading, unsavedChanges} : Props) {
  return (
    <table className={`m-2 position-fixed top-0 ${isLoading && "placeholder-wave"}`} style={{width: "280px"}}>
      {false ?
      <tbody className='placeholder col-12 bg-secondary'></tbody>
      :
      <tbody className='w-100'>
        <tr className='d-flex justify-content-end'>
          <th className={`${classes.leftBorder} ${classes.leftRounded} ${classes.background} p-2`}>
            <IconButton 
              icon={UndoSVG} 
              label={"Exit board"}
              side={Side.Right}
              href='/boards'
            />
          </th>
          <th className={`flex-grow-1 p-2 ${classes.ellipsis} text-center align-content-center ${classes.background} ${classes.border} border-start-0`}>
            {board.name}
          </th>
          <th className={`${classes.rightBorder} ${classes.rightRounded} ${classes.background} p-2 align-content-center ${generalClasses.hintWrapper}`} role="status">
            <div className={`${unsavedChanges && "spinner-border opacity-50"}`} style={{width: "26px", height: "26px"}}>
              <CheckSVG width={26} className={`${unsavedChanges && "visually-hidden"}`}/>
            </div>
            <span className={`${generalClasses.hint} ${generalClasses.bottomHint}`}>
                {unsavedChanges ? "Saving" : "Changes saved"}
              </span>
          </th>
        </tr>
      </tbody>}
    </table>
  )
}

export default BoardMenu