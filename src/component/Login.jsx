import React ,{ useEffect, useState } from 'react';
import './css/login.css';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';



function Login({role, setRole}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpFormVisible, setOtpFormVisible] = useState(false);
  const [sendOtpButtonVisible, setSendOtpButtonVisible] = useState(true);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: email,
    };

    axios.post('/home/login', userData)
      .then((response) => {
        // console.log(response)
        console.log(response.status, response.data.token);
        setOtpFormVisible(true);
        setSendOtpButtonVisible(false);
        
      })
      .catch((error) => {
        console.log(error.response.status);
        if(error.response.status === 404){
          return swal("Oops!", "User Not Found! Please Signup", "error");
        }else if (error.response.status === 500){
          return swal("Oops!", "Unable To Login!", "error");
        }else{
          return swal("Oops!","Internal Error","error")
        }
      });
  };
  const navigate = useNavigate();

  const handleChange1 = (e) => {
    setPassword(e.target.value);
  };
  // const userRole = (data) => {
  //   setRole()
  // }

  // const [newRole, setNewRole] = useState({})
  useEffect(() => {
  }, [role]);

  const getRole = async() =>{
        await axios.get("/home/get-role")
        .then((response)=>{
            // console.log(response.data)
            const userRole = response.data
            console.log("role3",userRole)
            setRole(userRole);
            // console.log(role)
        })
        .catch(error => console.error(`Error: ${error}`));
    }
    

  const handleSubmit1 = (e) => {
    e.preventDefault();
    const userData = {
      password: password,
    };
    console.log(userData)
    axios.post('/home/otp', userData)
    
    .then((response) => {
      console.log(response.status, response.data.token);
      getRole()
      navigate("/*")
    })
    .catch((error) => {
      console.log(error.response.status);
      if(error.response.status === 400){
        return swal("Oops!", "Wrong Password!", "error")
      }
    });
  };

  return (
    <>
      <div className="image-background" style={{ backgroundImage: `url('https://miro.medium.com/v2/resize:fit:1200/1*6Jp3vJWe7VFlFHZ9WhSJng.jpeg')` }}>
        <div className="login-form">
          <div className='heading'>
            <h1>Login</h1>
          </div>
          <form className="form-container" >
            <div className="group">
              <input type='email' name="email" placeholder='Email' onChange={handleChange} required />
            </div>
            {sendOtpButtonVisible && <button className="btn-1" type="submit" onClick={handleSubmit}>Next</button>}
          </form>
          {otpFormVisible && (
            <form className="form-container" >
              <input type="password" name="password" placeholder="Enter Password" onChange={handleChange1} required />
              <button className='btn-1' type="submit" onClick={handleSubmit1}>Sign In</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;