import React, { useState } from 'react'
import SideBar from './Sidebar'
import axios from 'axios';
import swal from 'sweetalert';

function IssueRequest() {

    const [data,setData] = useState({
        name: '',
        rid: '',
        Rtype: '',
      });
      const handleChange = (e) =>{
        const {name , value} =e.target;
        setData((prevData)=>({
          ...prevData,
          [name]: value,
        }))
      }

    const handleSubmit =(e)=>{
        e.preventDefault();

        axios.post('/user/issue-request', data, {
        headers: {
        'Content-type': 'multipart/form-data',}})
        .then((response) => {
            console.log(response.status, response.data.token);
            return swal("Good Job!","Request Raised Successfully!","success")
        })
        .catch((error) => {
            console.log(error.response);
            if(error.response.status === 404){
                return swal("Oops!", "Book Not Found!", "error");
            }else{
                return swal("Oops!","Please Check Feed Data!","error")
            }
        });
    }

    return (
        <div className="box-container">
            <SideBar/>
            <div className="addBook-div">
                <h1>Issue Request</h1>
                <form className="group-book">
                    <input type="text" placeholder="ISBN" onChange={handleChange} name="isbn" required/>
                    <input type="number" placeholder="UserID" onChange={handleChange} name="rid" required/>
                    <input type="text" placeholder="Request Type" onChange={handleChange} name="Rtype" required/>
                    <button className="btn-3" type="submit" onClick={handleSubmit} >Submit Request</button>
                </form>
            </div>
        </div>
    )
}

export default IssueRequest
