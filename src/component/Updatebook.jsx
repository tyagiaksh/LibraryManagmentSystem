import React, {useState} from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import Sidebar from './Sidebar.jsx';

function Updatebook() {
    const [data,setData] = useState({
        isbn: '',
        lib_id: '',
        title: '',
        author: '',
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
    
        axios.post('/admin/update-book', data, {
          headers: {
          'Content-type': 'multipart/form-data',}})
          .then((response) => {
            console.log(response.status, response.data.token);
            return swal("Good Job!","Book Updated Successfully!","success")
          })
          .catch((error) => {
            console.log(error.response);
            if(error.response.status === 500){
              return swal("Oops!", "Failed to update Book!", "error");
            }else{
              return swal("Oops!",error.response.status,"error")
            }
          });
      }
  return (
    <>
      <div className='box-container'>
        <Sidebar/>
        <div className="addBook-div">
            <h1>Update Book</h1>
            <form class="group-book" >
                <input type="text" placeholder="ISBN" name="isbn" value={data.isbn} onChange={handleChange} required />
                <input type="number" placeholder="LibID" name="lib_id" value={data.lib_id} onChange={handleChange} required />
                <input type="text" placeholder="Title" name="title" value={data.title} onChange={handleChange} required />
                <input type="text" placeholder="Author" name="author" value={data.author} onChange={handleChange} required />
                <input type="text" placeholder="Publisher" name="publisher" value={data.publisher} onChange={handleChange} required />
                <input type="number" placeholder="Version" name="version" value={data.version} onChange={handleChange} required />
                <input type="number" placeholder="Total Copies" name="total_copies" value={data.total_copies} onChange={handleChange} required />
                <input type="number" placeholder="Available Copies" name="available_copies" value={data.available_copies} onChange={handleChange} required />
                <button className="btn-3" type="submit" onClick={handleSubmit} >Update Book</button>
            </form>
        </div>
      </div>
    </>
  )
}

export default Updatebook
