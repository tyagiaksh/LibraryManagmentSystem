import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';



function SideBar(){
    const [role, SetRole] = useState('')
    useEffect(() => {
        getRole(role);
    }, [role]);
    const getRole = async(role) =>{
        await axios.get("/home/get-role")
        .then((response)=>{
            // console.log(response.data)
            const userRole = response.data;
            console.log("role",userRole)
            SetRole(userRole);
            console.log(role)
        })
        .catch(error => console.error(`Error: ${error}`));
    }
    return (
    <>
        <Sidebar style={{paddingTop:"10px"}}>
            <Menu
                menuItemStyles={{
                    root: {
                        fontSize: '20px',
                        // fontWeight: 400,
                      },
                    button: {
                        // the active class will be added automatically by react router
                        // so we can use it to style the active menu item
                        [`&.active`]: {
                        backgroundColor: '#13395e',
                        color: '#b6c8d9',
                        },
                    },
                }}
            >
                {role === "Admin" && 
                    <>
                        <MenuItem component={<Link to="/books/addbook" />}> Add Book</MenuItem>
                        <MenuItem component={<Link to="/books/deletebook" />}>Delete Book</MenuItem>
                        <MenuItem component={<Link to="/books/updatebook" />}>Update Book</MenuItem>
                        <MenuItem component={<Link to="/books/listrequest" />}>List Request</MenuItem>
                        
                    </>
                }
                { role === "Reader" &&
                    <>
                        <MenuItem component={<Link to="/books/issuerequest" />}>Issue Request</MenuItem>
                    </>
                    }
                    <MenuItem component={<Link to="/books/allbooks" />}>All Books</MenuItem>
            </Menu>
        </Sidebar>
    </>
//   <div className="side-bar">
//     <ul>
//         <li >
//             <Link className="link-box" to="/books/addbook">Add Book</Link>
//         </li>
//         <li>
//             <Link className="link-box" to="/books/deletebook">Delete Book</Link>
//         </li>
//         <li>
//             <Link className="link-box" to="/books/updatebook">Update Book</Link>
//         </li>
//         <li>
//             <Link className="link-box" to="/books/listrequest">List Request</Link>
//         </li>

//     </ul>
//   </div>
)};

export default SideBar;