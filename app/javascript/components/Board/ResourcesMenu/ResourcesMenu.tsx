import React, { useState } from 'react'
import classes from './resourcesMenu.module.css'
import IconButton from '../../General/IconButton'
import { UndoSVG } from '../../svg/ToolsSVG'
import { Side } from '../../../Types/Canvas'

enum State {
  none = "none",
  properties = "properties",
}

function ResourcesMenu() {
  const [state, setState] = useState(State.none)

  const stateButtons = [
    {
      icon: UndoSVG,
      onClick: () => setState(State.properties),
      label: "Properties",
      isDisabled: false,
      isActive: state === State.properties
    },
    {
      icon: UndoSVG,
      onClick: () => setState(State.none),
      label: "none",
      isDisabled: false,
      isActive: false
    },
    {
      icon: UndoSVG,
      onClick: () => {},
      label: "123",
      isDisabled: false,
      isActive: false
    },
  ]

  return (
    <table className={`${classes.wrapper}`}><tbody>
      <tr>
          <td>
            {stateButtons.map((button, i) => (
              <IconButton key={i} 
                icon={button.icon}
                onClick={button.onClick}
                label={button.label}
                isDisabled={button.isDisabled}
                isActive={button.isActive}
                href={null}
                side={Side.Top}
              />
            ))}
          </td>
      </tr>

      <tr>
        <td>
          Resources
        </td>
      </tr>
    </tbody></table>
  )
}

export default ResourcesMenu