import React from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import { useEffect } from 'react';
import axios from "axios";
import {ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


function ChangePassword() {

    useEffect(() => {
        // 👇 add class to body element
        document.body.classList.add('bg-salmon');

    }, []);

    const [showhide, setShowhide] = useState('');
    const email=localStorage.getItem('email');
    const navigate=useNavigate()

    const myFormData = async (e) => {
        e.preventDefault();
        try{
            const data=new FormData(e.target)
            let Formvalues=Object.fromEntries(data.entries())
            Formvalues.email=email;
            let response = await axios.post('/web_api/changepassword',Formvalues);
            let data1=response.data;
            console.log(data1)
            if(data1.status){
                toast.success(data1.msg)
                setTimeout(()=>{
                    localStorage.clear()
                    navigate(`/`)
                },2000)
            }else{
                toast.error(data1.msg)
            }
        }catch (err){
            console.log(err);
            return false;
        }
    }

    return (
        <>

            <Header />

            <div className="main-content side-content pt-0">
                <div className="container-fluid">
                    <div className="inner-body">

                        <div className="page-header">
                            <div>
                                <h2 className="main-content-title tx-24 mg-b-5">Change Password</h2>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/admin">Home</Link>
                                    </li>

                                    <li className="breadcrumb-item active" aria-current="page">&nbsp;&nbsp;Change Password</li>
                                </ol>
                            </div>

                            {/* <div className="d-flex">
                                <div className="justify-content-center">
                                    <Link to="/geq-list">
                                        <Button type='button' variant="contained" className="mr-3 btn-pd btnBg"><i class="fal fa-angle-double-left"></i>&nbsp; Back</Button>
                                    </Link>
                                </div>
                            </div> */}

                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 table-responsive border border-bottom-0">
                                <div className="card custom-card">
                                    <div className="card-body">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-5 pt-3 pb-3">

                                              <form onSubmit={(e)=>myFormData(e)}>
                                                    <div className="row">

                                                        <div className="col-lg-12 mb-4">
                                                            <TextField id="filled-basic" type="password" fullWidth label="Current Password" variant="filled" name="old_password" />
                                                        </div>

                                                        <div className="col-lg-12 mb-4">
                                                            <TextField id="filled-basic" type="password" fullWidth label="New Password" variant="filled" name="new_password"/>
                                                        </div>

                                                        <div className="col-lg-12 mb-4">
                                                            <TextField id="filled-basic1" type="password" fullWidth label="Confirm Password" variant="filled" name="confirm_password"/>
                                                        </div>


                                                        <div className="col-lg-12 text-center">
                                                            <Button type='submit' variant="contained" className="mr-3 btn-pd">Save</Button>
                                                            <Button type='reset' variant="contained" className="btn btn-dark btn-pd">Reset</Button>
                                                        </div>

                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <ToastContainer position="top-right" />
        </>
    )
}

export default ChangePassword;
