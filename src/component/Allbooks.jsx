import React, {useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
import SideBar from './Sidebar.jsx'
import axios from 'axios';
import "./css/allbook.css"
import Popup from './Popup.jsx';
// import Searchbook from './Searchbook.jsx'

function Allbooks() {
  const [books, getBook] = useState([]);
  const url = "/admin/all-books";
  useEffect(() => {
    getBooks();
  }, []);
  const getBooks = async () => {
    await axios.get(`${url}`)
      .then((response) => {
        console.log(response.data)
        const allRequest = response.data;
        getBook(allRequest);
      })
      .catch(error => console.error(`Error: ${error}`));
  }

  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState();

  const handleSubmit = (book) => {
    setSelectedBook(book)
    setOpen(true)
  }


  return (
    <>
    
      <div className='box-container1' >
          <SideBar/> 

         {/* <Searchbook/> */}

        <div className="book-box1">
          <div className='List-book'>
            {books.map(book => (
              <>
                <button className='details-btn' key={book.id} onClick={() => handleSubmit(book)}>
                  <img className="image-book" alt="sliderImage" key={book.id} src={book.image} />
                </button>
                {open ?
                  <Popup selectedBook={selectedBook} setOpen={setOpen} />
                  : null
                }

              </>
              )
            )}
          </div>
        </div>
        
      </div>
    
    </>
  )
}


export default Allbooks

