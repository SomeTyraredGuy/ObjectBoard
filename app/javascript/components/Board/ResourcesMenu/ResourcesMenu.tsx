import React, { useState } from 'react'
import classes from './resourcesMenu.module.css'
import IconButton from '../../General/IconButton'
import { Side } from '../../../Types/Canvas'
import { FolderSVG, PaletteSVG } from '../../svg/ResourcesSVG'
import ObjectsProperties from './ObjectsProperties'
import ObjectsGroups from './ObjectsGroups'
import { CanvasState } from '../../../Types/Canvas'
import { CanvasStateUtils } from '../../../Types/CanvasStateUtils'

enum State {
  Properties = "Properties",
  Groups = "Groups",
}

type Props = {
  canvasState: CanvasState,
  canvasStateUtils: CanvasStateUtils,
  resourcesProperties
}

function ResourcesMenu({canvasState, canvasStateUtils, resourcesProperties}: Props) {
  const [state, setState] = useState(State.Properties)

  const stateButtons = [
    {
      icon: PaletteSVG,
      onClick: () => setState(State.Properties),
      label: "Properties",
      isActive: state === State.Properties
    },
    {
      icon: FolderSVG,
      onClick: () => setState(State.Groups),
      label: "Groups",
      isActive: state === State.Groups
    },
  ]

  return (
    <table className={`${classes.wrapper}`}><tbody>
      <tr>
          <td className='d-flex justify-content-evenly align-items-center'>
            {stateButtons.map((button, i) => (
              <IconButton key={i} 
                icon={button.icon}
                onClick={button.onClick}
                label={button.label}
                isActive={button.isActive}
                side={Side.Top}
              />
            ))}
          </td>
      </tr>

      <tr>
        <td>
          {state === State.Properties && 
            <ObjectsProperties 
              canvasState={canvasState} 
              canvasStateUtils={canvasStateUtils}
              resourcesProperties={resourcesProperties}
            />
          }
          {state === State.Groups && 
            <ObjectsGroups 
              canvasState={canvasState} 
              canvasStateUtils={canvasStateUtils}
            />
          }
        </td>
      </tr>
    </tbody></table>
  )
}

export default ResourcesMenu