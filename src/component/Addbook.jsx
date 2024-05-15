import React, { useState } from "react";
import "./css/addbook.css"
import swal from 'sweetalert';
import axios from 'axios';
import Sidebar from "./Sidebar.jsx";


function AddBook() {

  const [data,setData] = useState({
    isbn: '',
    lib_id: '',
    title: '',
    authors: '',
    publisher: '',
    version: '',
    total_copies: '',
    available_copies: '',
  });
  const handleChange = (e) =>{
    const {name , value} =e.target;
    setData((prevData)=>({
      ...prevData,
      [name]: value,
    }))
  }


  const handleSubmit = (e) =>{
    e.preventDefault();

    axios.post('/admin/add-book', data, {
      headers: {
      'Content-type': 'multipart/form-data',}})
      .then((response) => {
        console.log(response.status, response.data.token);
        return swal("Good Job!","Book Added Successfully!","success")
      })
      .catch((error) => {
        console.log(error.response);
        if(error.response.status === 403){
          return swal("Oops!", "Book Already Exist!", "error");
        }else if(error.response.status === 400){
          return swal("Oops!", "Bad Request!", "error");
        }else {
          return swal("Oops!","Server Error!","error")
        }
      });
  }

  return (
    <>
    
      <div className="box-container">
      <Sidebar/>
      <div className="addBook-div">
        <h1 >Add a Book</h1>
        <form className="group-book">
            <input type="text" placeholder="ISBN" name="isbn" value={data.isbn} onChange={handleChange} required />
            <input type="number" placeholder="LibID" name="lib_id" value={data.lib_id} onChange={handleChange} required />
            <input type="text" placeholder="Title" name="title" value={data.title} onChange={handleChange} required />
            <input type="text" placeholder="Author" name="authors" value={data.authors} onChange={handleChange} required />
            <input type="text" placeholder="Publisher" name="publisher" value={data.publisher} onChange={handleChange} required />
            <input type="number" placeholder="Version" name="version" value={data.version} onChange={handleChange} required />
            <input type="number" placeholder="Total Copies" name="total_copies" value={data.total_copies} onChange={handleChange} required />
            <input type="number" placeholder="Available Copies" name="available_copies" value={data.available_copies} onChange={handleChange} required />
            <input type="text" placeholder="Image" name="image" value={data.image} onChange={handleChange} required />
            <button className="btn-3" type="submit" onClick={handleSubmit} >Add Book</button>
        </form>
      </div>
      
      </div>
    </>
  );
}

export default AddBook;