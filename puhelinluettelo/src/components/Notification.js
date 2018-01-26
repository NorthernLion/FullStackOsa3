import React from 'react'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='notificaton'>
      {message}
    </div>
  )
}

export default Notification