import React from 'react'

function SideBar() {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='bg-dark col-auto col-md-3 min-vh-100'>
          <a className='text-decoration-none text-white d-flex align-itemcenter' href='/'>
            <i className='bi bi-speedometer'></i>
            <span className='ms-1 fs-4'>Object Boarad</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default SideBar