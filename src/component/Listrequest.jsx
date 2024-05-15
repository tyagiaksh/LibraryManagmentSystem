import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./css/listrequest.css"
import swal from 'sweetalert';
import Sidebar from './Sidebar.jsx';

function Listrequest() {
    const [request,getRequest] = useState([]);

    useEffect(() => {
    }, [request]);
    
    const url = "/admin/list-issue-request";

    const getAllRequest= async ()=>{
        await axios.get(`${url}`)
        .then((response)=>{
            console.log(response.data)
            const allRequest = response.data;
            getRequest(allRequest);
        })
        .catch(error => console.error(`Error: ${error}`));
    }


    const  acceptRequest = (id) =>{
        // e.preventDefault();
        console.log(id)
        
        const data = {
            ReqID: id,
          };
        console.log(data)
        axios.post('/admin/approve-request', data,{headers : {
            'Content-Type': 'application/json'
          }})
        .then((response) => {
            console.log(response.status, response.data.token);
            return swal("Good Job!","Request Approved Successfully!","success")
        })
        .catch((error) => {
            console.log(error.response);
            if(error.response.status === 404){
                return swal("Oops!", "Data Not Given!", "error");
            }else{
                return swal("Oops!","error.response.status","error")
            }
        });
    
    }
    const rejectRequest = (id) =>{
        console.log(id)
        
        const data = {
            ReqID: id,
          };
        console.log(data)
        axios.post('/admin/reject-request', data,{headers : {
            'Content-Type': 'application/json'
          }})
        .then((response) => {
            console.log(response.status, response.data.token);
            return swal("Good Job!","Request Rejected Successfully!","success")
        })
        .catch((error) => {
            console.log(error.response);
            if(error.response.status === 404){
                return swal("Oops!", "Data Not Given!", "error");
            }else{
                return swal("Oops!","error.response.status","error")
            }
        });
    }


    const renderTable = () => {
        getAllRequest()
        return request.map((issue,key) => {
            return(
                <tr key={key}>
                    <td>{issue.ReqID}</td>
                    <td>{issue.BookID}</td>
                    <td>{issue.ReaderID}</td> 
                    <td>{issue.RequestDate}</td> 
                    <td>{issue.ApprovalDate}</td> 
                    <td>{issue.ApproverID}</td> 
                    <td>{issue.RequestType}</td> 
                    <td>{issue.Request}</td>  
                    <td>
                        <button onClick={() => acceptRequest(issue.ReqID)} >Accept</button>
                        <button onClick={() => rejectRequest(issue.ReqID)} >Reject</button> 
                    </td>
                </tr>
            )
        })
    }
  return (
    <>
        <div className='box-container'>

              <Sidebar />

            <div className='Listrequest'>
                <table > 
                    <thead>
                        <tr> 
                            <th>ReqID</th> 
                            <th>BookID</th> 
                            <th>ReaderID</th> 
                            <th>Request Date</th> 
                            <th>Approval Date</th> 
                            <th>Approver ID</th> 
                            <th>Request Type</th> 
                            <th>Request Status</th> 
                            <th>Action</th>
                        </tr> 
                    </thead>
                   
                    <tbody>
                        {renderTable()}
                    </tbody>
                </table>  
            </div>

        </div>
    </>
  )
}

export default Listrequest
