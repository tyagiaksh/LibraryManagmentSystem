import React, { useState } from "react";
import axios from 'axios';
import './css/signup.css'
import swal from 'sweetalert';

function Signup() {

  const [data, setData] = useState({
    name: '',
    email: '',
    contact_number: '',
    role: 'Reader',
    lib_id: 1,
    password: '',
  });


  const handleChange = (e) => {
    const {name , value} =e.target;
    setData((prevData)=>({
      ...prevData,
      [name]: value,
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    
    axios.post('/home/signup', data,{
      headers: {
      'Content-type': 'multipart/form-data',}})
      .then((response) => {
        console.log(response.status, response.data.token);
        return swal("Good Job!","User Added Successfully","success")
      })
      .catch((error) => {
        console.log(error.response);
        if(error.response.status === 404){
          return swal("Oops!", "User Already Exist! Please Login", "error");
        }else{
          return swal("Oops!",error.response.status,"error")
        }
      });
  };
  return (
    <>
        <div className="image-background" style={{ backgroundImage: `url('https://miro.medium.com/v2/resize:fit:1200/1*6Jp3vJWe7VFlFHZ9WhSJng.jpeg')` }}>
          <div className="signup-form">
            <div className='heading'>
                <h1>Signup</h1>
            </div>
              <form className="form-container" >
                      <input type="text" placeholder="Name" name="name" value={data.name}  onChange={handleChange} required/>
                      <input type="email" name="email"  placeholder="Email" value={data.email}  onChange={handleChange} required/>
                      <input type="text"  placeholder="Contact" name="contact_number" value={data.contact_number}  onChange={handleChange} required/>
                      <input type="text" name="role" value={data.role} readOnly="readonly"  />
                      <input type="number" value="1" name={data.lib_id} readOnly="readonly" />
                      <input type="password"  placeholder="Password" name="password" value={data.password}  onChange={handleChange} required/>
                      <button className='btn-2' type="submit" onClick={handleSubmit} >Submit</button>
              </form>
          </div>
        </div>
    </>
  )
}
export default Signup;