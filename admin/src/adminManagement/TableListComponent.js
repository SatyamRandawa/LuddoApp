import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ReactPaginate from "react-paginate";
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'moment';
import Swal from 'sweetalert2'

function TableListComponent(props) {

    const navigate = useNavigate();


    const [open, setOpen] = React.useState(false);
    const [pageCount, setpageCount] = useState('');
    const [guestUser, setGuest] = React.useState(null);
    const [Fromvalue, setFromvalue] = React.useState('');


    const [data, setData] = useState([])


    // const [guestUser, setGuest] = React.useState(0);

  



    const limit = 10;
    
    const formsave = (e, page)=>{
        e.preventDefault();
          const data = new FormData(e.target);
         const Formvlaues = Object.fromEntries(data.entries());
         Formvlaues.disclosed_status = guestUser
         const formData = Formvlaues
         setFromvalue(formData);
           console.log('Formvlaues === ', Formvlaues);
            axios.post(`/web_api/poll_list`, formData )
           .then(res => {
               const data = res.data.body;
               setData(data);
               const total = res.data.rows;
               const totalPage = (Math.ceil(total / limit));
               setpageCount(totalPage);
           })
     }
     
    const adminlist = async () => {
        const datadammy = {}
        await axios.get(`/web_api/viewAdmin`, datadammy)
            .then(res => {
                
                const invailid = res.data

                const data = res.data.body;
                const total = res.data.rows;
                const totalPage = (Math.ceil(total / limit));
                setpageCount(totalPage);
                setData(data);
                console.log(data);
                setValue("");
                setValue1("");
               
            })
    }
    useEffect(() => {
        adminlist()
    }, [])


    ///////////////pagenestion///////////////
    const fetchComments = async (page) => {
        const senData = { guest_user : guestUser, page: page }
        // const cosole = Fromvalue;
        // console.log(Fromvalue);
        axios.get(`/web_api/viewAdmin`, senData)
            .then(res => {
                const data = res.data.body;
                setData(data);
            })
        return data;
    };

    const handlePageClick = async (data) => {
        // console.log(data.selected);
        const page = data.selected + 1;
        const commentsFormServer = await fetchComments(page);
        setData(commentsFormServer);
    };

/////////////////delete poll /////////////////
    const delAdmin = (_id) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {         
                
                  axios.delete(`/web_api/deleteAdmin/${_id}`)
                  .then(res => {
                      if (res.status) {
                          let data = res.data;
                          if (data.status) { 
                            Swal.fire(
                                'Deleted!',
                                 data.msg,
                                'success'
                              )
            
                              return adminlist();
                              
                          } else {
                              toast.error('something went wrong please try again');
                          }
                      }
                      else {
                          toast.error('something went wrong please try again..');
                      }
      
                  })
            }
          })

       
           
    }

    const [value, setValue] = useState("");
    const [value1, setValue1] = useState("");



    const editFun = (id)=>{
        navigate(`/admin/update/${id}`)
      return false;   
    }
    
    

    return (

        <>

<ToastContainer position="top-right" />
 

             
      
            <div className="row">
                <div className="col-lg-12">
                    <div className="table-card MuiPaper-root MuiPaper-elevation2 MuiPaper-rounded">
                        <h6 className="MuiTypography-root MuiTypography-h6 padd1rem">Admin List</h6>
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Mobile</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Access</th>
                                    <th scope="col" className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                              {data == '' ? <>
                               <tr>
                               <td className="text-center" colSpan='9'> 
                                 <img src="/assets/images/nodatafound.png" alt='no image' width="350px" /> </td>
                               </tr>
                               </> : null}
                                {data.map((item) => {
                                    return (
                                        <tr key={item._id}>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.mobile}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.address}</td>
                                            <td>{Moment(item.date).format("DD/MM/YYYY")}</td>
                                            <td>{item.create_admin==true?"Full":"Semi"}</td>
                                            <td className="text-end">
                                                <div className="d-flex justtify-content-end">
                                                    <IconButton onClick={(e) => { editFun(item._id); }} aria-label="edit">
                                                        <span className="material-symbols-outlined">
                                                        Edit </span>
                                                    </IconButton>
                                                    <IconButton onClick={(e) => { delAdmin(item._id); }} aria-label="delete">
                                                        <span className="material-symbols-outlined">
                                                        Delete </span>
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    );


                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-12 mt-2 text-end">
                        <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-end"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </div>
                </div>
                <div>
                </div>
            </div>
           
        </>

    )
}

export default TableListComponent