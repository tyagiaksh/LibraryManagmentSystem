import React, { useEffect, useState } from 'react'
import "./css/search.css"
import axios from 'axios'
import swal from 'sweetalert';
import { BiSearchAlt } from "react-icons/bi";
import Searchresult from './Searchresult.jsx';



function Searchbook() {

  const [book, getBook] = useState([]);
  const [searchdata, setSearchData] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState();


  const handleChange = (e) => {
    setSearchData(e.target.value)
  }

  useEffect(() => {
  // const handleSubmit = setTimeout(() => {
  //       axios.get(`/home/search/${searchdata}`)
  //         .then((response) => {
  //           const allRequest = response.data;
  //           getBook(allRequest);
  //           console.log(book);
  //           if (book != null) {
  //             setSelectedBook(book)
  //             setOpen(true)
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error.response);
  //           if (error.response.status === 404) {
  //             return swal("Oops!", "Book Not Found!", "error");
  //           } else {
  //             return swal("Oops!", "Enter Somthing!", "error")
  //           }
  //         });
  //     }, 3000);

  //   return () => {
  //     clearTimeout(handleSubmit)
  //   }
  }, [book])
  const handleSubmit =() => {
        axios.get(`/home/search/${searchdata}`)
          .then((response) => {
            const allRequest = response.data;
            getBook(allRequest);
            console.log(book);
            if (book != null) {
              setSelectedBook(book)
              setOpen(true)
            }
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status === 404) {
              return swal("Oops!", "Book Not Found!", "error");
            } else {
              return swal("Oops!", "Enter Somthing!", "error")
            }
          });
      }

  return (
  <>
    <div className='search-container'>
        <input className='search-input' type="search" placeholder='Search....' name='title' value={searchdata.title} onChange={handleChange} />
        <BiSearchAlt onClick={() => handleSubmit(searchdata)} /> 
        {open ?
          <Searchresult selectedBook={selectedBook} setOpen={setOpen} />
          : null
        }
      
      </div>
      
  </>
  )
}

export default Searchbook
// 