import './App.css';
import Book from "./component/Book.jsx"
import About from './component/About.jsx';
import ContactUs from './component/Contactus.jsx';
import Home from './component/Home.jsx';
import Issue from './component/Issue.jsx'
import {Route, Routes } from "react-router-dom";
import Login from './component/Login.jsx';
import SignUp from './component/Signup.jsx';
import AddBook from "./component/Addbook.jsx"
import DeleteBook from "./component/Deletebook.jsx"
import Navbar from "./component/Navbar.jsx";
import UpdateBook from "./component/Updatebook.jsx"
import ListRequest from "./component/Listrequest.jsx"
import SearchBook from "./component/Searchbook.jsx"
import AllBooks from "./component/Allbooks.jsx"
import IssueRequest from './component/IssueRequest.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchResult from './component/Searchresult.jsx';



function App() {
  const [role, setRole] = useState('')
    useEffect(() => {
        getRole(role);
    }, [role]);
    const getRole = async(role) =>{
        await axios.get("/home/get-role")
        .then((response)=>{
            // console.log(response.data)
            const userRole = response.data;
            console.log("role",userRole)
            setRole(userRole);
            console.log(role)
        })
        .catch(error => console.error(`Error: ${error}`));
    }
  return (
    <>
      <div className="App">
        <Navbar role={role} setRole={setRole} /> 
          <Routes>
          <Route path="/*" element={<Home role={role} />}></Route>
            <Route path="/books/*" element={<Book role={role} />}></Route>
            <Route path="/issue" element={<Issue/>}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<ContactUs  />}></Route>
            <Route path="/login" element={<Login role={role} setRole={setRole} />}></Route>
            <Route path="/signup" element={<SignUp/>}></Route>
            <Route path="/books/addbook" element={<AddBook/>}></Route>
            <Route path="/books/deletebook" element={<DeleteBook/>}></Route>
            <Route path="/books/updatebook" element={<UpdateBook/>}></Route>
            <Route path="/books/listrequest" element={<ListRequest/>}></Route>
            <Route path="/searchbook/*" element={<SearchBook/>}></Route>
            <Route path="/books/allbooks" element={<AllBooks/>}></Route>
            <Route path="/books/issuerequest" element={<IssueRequest />}></Route>
            <Route path="/searchbook/result" element={<SearchResult/>}></Route>
        </Routes>
        
        </div>
    </>
)};

export default App;
