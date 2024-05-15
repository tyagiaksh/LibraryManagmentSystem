import React, { useState }  from 'react'
import axios from 'axios';
import swal from 'sweetalert';
import Sidebar from './Sidebar.jsx';

function Deletebook() {
    const [data,setData] = useState({isbn: ''});
    const handleChange = (e) =>{
        const {name , value} =e.target;
        setData((prevData)=>({
          ...prevData,
          [name]: value,
        }))
      }

    const handleSubmit = (e)=>{
        e.preventDefault();

        axios.post('/admin/delete-book', data, {
        headers: {
        'Content-type': 'multipart/form-data',}})
        .then((response) => {
            console.log(response.status, response.data.token);
            return swal("Good Job!","Book Deleted Successfully","success")
        })
        .catch((error) => {
            console.log(error.response);
            if(error.response.status === 404){
            return swal("Oops!", "Book Not Found", "error");
            }else if (error.response.status === 500){
                return swal("Oops!", "Failed to Delete Book!", "error");
            }else{
            return swal("Oops!",error.response.status,"error")
            }
        });
    }
  return (
    <>
      <div className='box-container'>
        <Sidebar/>

        <div style={{
          height:"calc(50vh - 10px);",
          width:"50vh",
          margin:"auto",
          marginTop:"90px",
          marginLeft:"30%"
          }}>
            <form style={{display:"flex", flexDirection:"column", width:"20rem"}}>
            
            <h2 style={{fontFamily:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif", fontWeight:"300", marginBottom:"30px"}}>Enter ISBN </h2>
            <input style={{padding:"0.5rem",border:"1px solid black", borderRadius:"0.5rem"}} type="text" placeholder="ISBN" name="isbn" onChange={handleChange} required/>
            <button className="btn-3" type="submit" onClick={handleSubmit} >Delete Book</button>
            </form>
        </div>
        </div>
    </>
  )
}

export default Deletebook
