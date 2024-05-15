import React from 'react'
import './css/popup.css'


const Popup = ({selectedBook, setOpen}) => {
  return (
    <div className="popup-container">
      <div className="popup-body">
        <p>ISBN: {selectedBook?.isbn}</p>
        <p>LibID: {selectedBook?.lib_id}</p>
        <p>Title: {selectedBook?.title}</p>
        <p>Author: {selectedBook?.authors}</p>
        <p>Publisher: {selectedBook?.publisher}</p>
        <p>Version: {selectedBook?.version}</p>
        <p>Total Copies: {selectedBook?.total_copies}</p>
        <p>Available Copies: {selectedBook?.available_copies}</p>
        <button onClick={() => setOpen(false)}>Close X</button>
      </div>
    </div >
  )
}

export default Popup
