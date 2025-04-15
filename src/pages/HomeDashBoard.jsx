import React from 'react'
import SideDashboard from '../components/Dashboard/SideDashboard'
import Dashboard from '../components/Dashboard/Dashboard'
import '../components/Dashboard/dashboard-layout.css'

const HomeDashBoard = () => {
  return (
    <div className='dashboard-container'>
      <div className='sidedashboard-links'>
        {/* <SideDashboard /> */}
      </div>
      <div className='dashboard-content'>
        <Dashboard />
      </div>
    </div>
  )
}

export default HomeDashBoard
