import React, { useEffect } from "react";
import "./css/navbar.css"
import { Link, useNavigate } from "react-router-dom";
import Searchbook from "./Searchbook.jsx";
import axios from "axios";
import swal from "sweetalert";



export default function Navbar({ role, setRole }) {
    
//     const [showNavbar, setShowNavbar] = useState(false)

//   const handleShowNavbar = () => {
//     setShowNavbar(!showNavbar)
//   }
    
    const navigate = useNavigate();

    useEffect(() => {
        console.log("role2", role)
    }, [role]);
    const handleSubmit = async()=>{
        await axios.get("/home/logout")
        .then((response)=>{
            console.log(response.data)
            // const userRole = response.data;
            console.log("role1", role)
            setRole('')
            navigate("/*")
            return swal("Good Job!","Logout Successfully!","success")
        })
        .catch(error => console.error(`Error: ${error}`));
    }
    
    return (
        <> 
            <nav className="navbar" >
                <div className="navbar-box">
                    <div className="box">
                        <Link className="headings-nav" to="/">Library</Link>
                    </div>
                    {/* <div className="menu-icon" onClick={handleShowNavbar}>
                        <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CjxwYXRoIGQ9Ik0gMCA5IEwgMCAxMSBMIDUwIDExIEwgNTAgOSBaIE0gMCAyNCBMIDAgMjYgTCA1MCAyNiBMIDUwIDI0IFogTSAwIDM5IEwgMCA0MSBMIDUwIDQxIEwgNTAgMzkgWiI+PC9wYXRoPgo8L3N2Zz4="/>
                    </div> */}
                    <div className="nav-elements">
                            <ul className="ul-box">
                                <li className="li-box">
                                    <Link className="headings1"  to="/books">Books</Link>
                                </li>
                                <li className="li-box">
                                    <Link className="headings1" to="/about">About</Link>
                                </li>
                        </ul>
                        <div className="search-box">
                            <Searchbook/>
                        </div>
                        {role === null ?
                            <>
                                <button className="new-btn"  style={{margin:"20px"}} >
                                    <Link className="login-form1" to="/login">Login</Link>
                                </button>
                                <button className="new-btn1"  style={{margin:"20px"}} >
                                    <Link className="login-form2" to="/signup">Signup</Link>
                                </button>
                            </>
                            :<>
                            <button className="new-btn1" style={{margin:"20px", color:"#3089fd"}} onClick={handleSubmit}>Logout</button>
                            </>
                        }
                    </div>
                    
                    
                </div>
            </nav>

        </>
    )
}

