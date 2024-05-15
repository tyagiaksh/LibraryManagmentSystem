import React from 'react'
import "./css/searchresult.css"

  

const Searchresult = ({selectedBook, setOpen}) => {
    
        
    return (
        <div className="popup-book">
            <div className="book-body">
                <div className='image-body'>
                    <img className="image-search" alt="sliderImage"  src={selectedBook?.image} />
                </div>
                <div className='data-body'>
                    <p>ISBN: {selectedBook?.isbn}</p>
                    <p>LibID: {selectedBook?.lib_id}</p>
                    <p>Title: {selectedBook?.title}</p>
                    <p>Author: {selectedBook?.authors}</p>
                    <p>Publisher: {selectedBook?.publisher}</p>
                    <p>Version: {selectedBook?.version}</p>
                    <p>Total Copies: {selectedBook?.total_copies}</p>
                    <p>Available Copies: {selectedBook?.available_copies}</p>
                </div>
                <div >
                    <button className='details-btn1' onClick={() => setOpen(false)}>Close X</button>  
                </div>
                 
            </div>
            
        </div>
    )
}

export default Searchresult
