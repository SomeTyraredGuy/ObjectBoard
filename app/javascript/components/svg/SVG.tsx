import React from 'react'

type Props = {
    width: number,
    height: number,
    children: React.ReactNode;
}

function SVG({width, height, children} : Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
  )
}

export default SVG