import React from 'react'

const PlaceholderPage = ({ title }) => {
  return (
    <div className="placeholder-page">
      <h1>{title} Page</h1>
      <p>This is the {title.toLowerCase()} page content</p>
    </div>
  )
}

export default PlaceholderPage
