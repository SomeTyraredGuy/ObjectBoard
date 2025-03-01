import React from 'react'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'
import { PaletteSVG } from '../../svg/ResourcesSVG'
import ColorPicker from '../../General/Inputs/ColorPicker/ColorPicker'
import { ChangeObjectProperty } from '../Canvas/scripts/hooks/canvasObjectsHooks/UseObjects'
import { CanvasObjectType, numOfObjectTypes } from '../../../Types/CanvasObjects'

type Props = {
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  resourcesProperties: {
    changeProperty: (ChangeObjectProperty) => void,
  }
}

function ObjectsProperties({canvasState, setCanvasState, resourcesProperties}: Props) {
  if (canvasState.mode !== CanvasMode.Selected && canvasState.mode !== CanvasMode.Inserting) return (
    <div className='p-5'>
      <PaletteSVG/>
      <p className='p-2 text-center'>No object to be edit</p>
    </div>
  )

  const {
    changeProperty
  } = resourcesProperties

  const setColorOf = (propertyName: "fill" | "stroke") => {
    return (color: string) => {
      if (canvasState.mode === CanvasMode.Inserting) {
        setCanvasState({
          ...canvasState,
          startingProperties: {
            ...canvasState.startingProperties,
            [propertyName]: color
          }
        })
      }
      if (canvasState.mode === CanvasMode.Selected) {
        changeProperty({
          propertyName: propertyName,
          newValue: color
        })
      }
    }
  }

  let defaultProperties
  switch (canvasState.mode) {
    case CanvasMode.Selected:

      let foundTypes: CanvasObjectType[] = []
      for (const object of canvasState.objects){
        if (!foundTypes.includes(object.type)){
          foundTypes.push(object.type)
          defaultProperties = {
            ...defaultProperties, 
            ...object
          }
        }

        if (foundTypes.length === numOfObjectTypes) break
      }
      break

    case CanvasMode.Inserting:
      defaultProperties = {
        stroke: canvasState.startingProperties.stroke,
      }
      if (canvasState.startingProperties.type !== CanvasObjectType.Line){
        defaultProperties = {
          ...defaultProperties,
          fill: canvasState.startingProperties.fill,
        }
      }
      break
  }

  const properties = [
    <ColorPicker 
      label='Fill'
      initialValue={defaultProperties.fill}
      setColor={ setColorOf("fill") }
    />,

    <ColorPicker 
      label='Stroke'
      initialValue={defaultProperties.stroke}
      setColor={ setColorOf("stroke") }
    />,
  ]
    
  return (
    <div className='h-100 d-flex flex-column align-items-start ps-3 pt-3'>
      {properties.map((property, i) => {
        if (!property.props.initialValue) return null
        
        return(
          <div key={i} className='mb-3'>
            {property}
          </div>
        )
      })}
    </div>
  )
}

export default ObjectsProperties