import React from 'react'
import SVG from './SVG'

type Props = {
    width: number,
    height?: number,
    className?: string
}

function CheckSVG({width, height = width, className} : Props) {
  return (
    <SVG width={width} height={height} className={className}>
        <path d="M20 6 9 17l-5-5"/>
    </SVG>
  )
}

export default CheckSVG