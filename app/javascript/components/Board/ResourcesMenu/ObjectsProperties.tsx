import React from 'react'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'
import { PaletteSVG, TrashSVG } from '../../svg/ResourcesSVG'
import ColorPicker from '../../General/Inputs/ColorPicker/ColorPicker'
import { ObjectPropertyChange } from '../../../Types/ObjectPropertyChange'
import { CanvasObjectType, numOfObjectTypes } from '../../../Types/CanvasObjects'
import Slider from '../../General/Inputs/Slider/Slider'
import classes from '../../General/general.module.css'
import IconButton from '../../General/IconButton'

type Props = {
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  resourcesProperties: {
    changeProperty: (ObjectPropertyChange) => void,
    deleteSelectedObjects: () => void
  }
}

function ObjectsProperties({canvasState, setCanvasState, resourcesProperties}: Props) {
  if (canvasState.mode !== CanvasMode.Selected && canvasState.mode !== CanvasMode.Inserting) return (
    <div className='p-5'>
      <PaletteSVG/>
      <p className='p-2 text-center fs-4 fw-bold'>No object to be edit</p>
    </div>
  )

  const {
    changeProperty,
    deleteSelectedObjects
  } = resourcesProperties

  const setProperty = <P extends ObjectPropertyChange["propertyName"]>(propertyName: P) => {
    return (
      value: Extract<ObjectPropertyChange, { propertyName: P }>["newValue"]
    ) => {
      if (canvasState.mode === CanvasMode.Inserting) {
        setCanvasState({
          ...canvasState,
          startingProperties: {
            ...canvasState.startingProperties,
            [propertyName]: value
          }
        })
      }
      if (canvasState.mode === CanvasMode.Selected) {
        changeProperty({
          propertyName: propertyName,
          newValue: value
        })
      }
    }
  }

  let defaultProperties
  switch (canvasState.mode) {
    case CanvasMode.Selected:

      let foundTypes: CanvasObjectType[] = []
      for (const object of canvasState.objects){
        if (!object) continue

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
        ...defaultProperties,
        ...canvasState.startingProperties
      }
      break
  }

  const properties = [
    <ColorPicker 
      label='Fill'
      value={defaultProperties.fill}
      setColor={ setProperty("fill") }
    />,

    <ColorPicker 
      label='Stroke'
      value={defaultProperties.stroke}
      setColor={ setProperty("stroke") }
    />,

    <Slider
      min={0}
      max={50}
      step={1}
      label='Stroke Width'
      value={defaultProperties.strokeWidth}
      onChange={ setProperty("strokeWidth") }
    />,

    <Slider
      min={0.1}
      max={1}
      step={0.01}
      multiple100={true}
      units='%'
      label='Opacity'
      value={defaultProperties.opacity}
      onChange={ setProperty("opacity") }
    />,

    <Slider
      min={0}
      max={1}
      step={0.01}
      multiple100={true}
      units='%'
      label='Corner Radius'
      value={defaultProperties.cornerRadius}
      onChange={ setProperty("cornerRadius") }
    />,
  ]
    
  return (
    <div className={`h-100 d-flex flex-column align-items-start p-3 ${classes.scroll}`}>
      {properties.map((property, i) => {
        if (property.props.value === undefined) return null
        
        return(
          <div key={i} className='mb-3 w-100'>
            {property}
          </div>
        )
      })}
      <IconButton 
        icon={TrashSVG}
        label='Delete'
        side={4}
        onClick={deleteSelectedObjects}
      />
    </div>
  )
}

export default ObjectsProperties