import React from "react";
import Header from "../Header";
import { Link, Navigate } from "react-router-dom";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams ,useNavigate} from 'react-router-dom';
import InputEmoji from 'react-input-emoji'
import { fabClasses } from "@mui/material";

export default function UpdateAdmin() {
  
  const navigate=useNavigate()
  const { id } = useParams();
  console.log(id);

  const [data, setData] = useState([])
  const [gender, setGender] = React.useState([]);
  const handleChangeGender = (event) => { setGender(event.target.value); }

  const [access, setAccess] = React.useState([]);
  console.log(access);

  const handleChangeAccess = (event) => { setAccess(event.target.value); }
  
  const adminDetails = async ()=>{
    try{  
        const datadammy = {}
    await axios.get(`/web_api/viewAdmin/${id}`, datadammy)
        .then(res => {
         
            const data = res.data.body[0];
         
            setData(data);
            setGender(data.gender);
            if(data.create_admin == true)
            {
              setAccess(1);
            }else{
              setAccess(0)
            }
            console.log(data);
           
           
        })

    }catch (err) { console.error(err); toast.error('some errror'); return false; }
  }


  useEffect(() => {
    adminDetails()
  }, [])



  const myFormData = async (e) => {
    e.preventDefault();

    try {

      const data = new FormData(e.target);
      let Formvlaues = Object.fromEntries(data.entries());
      //console.log("form data is == ", Formvlaues);
      // Formvlaues.fee_type = showhide;
      // Formvlaues.poll_type = p_type;
    
      let response = await axios.put(`/web_api/updateAdmin/${id}`, Formvlaues);
      //console.log('my fun call', response);
      if (response.status) {
        let data = response.data;
        if (data.status) {
          toast.success(data.msg);
          setTimeout(()=>{
            navigate(`/admin`)
          },2000)
        } else {
          toast.error('something went wrong please try again');
        }
      }
      else {
        toast.error('something went wrong please try again..');
      }

    } catch (err) { console.error(err); toast.error('some errror'); return false; }


  }




  return (
    <>
       <Header />

<div className="main-content side-content pt-0">
  <div className="container-fluid">
    <div className="inner-body">

      <div className="page-header">
        <div>
          <h2 className="main-content-title tx-24 mg-b-5">Update Admin</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin">Admin</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">&nbsp;&nbsp;AdminManagement</li>
          </ol>
        </div>
        <div className="d-flex">
          <div className="justify-content-center">
            <Link to="/admin" className="btn-link">
              <i className="fal fa-angle-double-left"></i>&nbsp; Back
            </Link>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-12 table-responsive border border-bottom-0">
          <div className="card custom-card">
            <div className="card-body">
              <div className="row justify-content-center">
                <div className="col-lg-8">

                  <form onSubmit={(e) => myFormData(e)}>
                    <div className="row">

                    <div className="col-lg-12 mb-4">
                        <label className="title-col">Name <span className="text-blue"></span></label>
                        <TextField id="filled-multiline-static" name='name'  multiline rows={1} fullWidth  variant="filled" autoComplete="off" defaultValue={data.name} />

                      </div>
                
                      <div className="col-lg-12 mb-4">
                        <label className="title-col">Email <span className="text-blue"></span></label>
                        <TextField id="filled-multiline-static" name='email'  multiline rows={1} fullWidth  variant="filled" autoComplete="off" defaultValue={data.email}/>

                      </div>
                      <div className="col-lg-12 mb-4">
                        <label className="title-col">Mobile <span className="text-blue"></span></label>
                        <TextField id="filled-multiline-static" name='mobile'  multiline rows={1} fullWidth  variant="filled" autoComplete="off" defaultValue={data.mobile}/>

                      </div>
                      <div className="col-lg-12 mb-4">
                        <label className="title-col">Password <span className="text-blue"></span></label>
                        <TextField id="filled-multiline-static" name='password'  multiline rows={1} fullWidth  variant="filled" autoComplete="off" defaultValue={data.password}/>

                      </div>
                      <div className="col-lg-12">
                        <label className="title-col">Gender</label>
                         
                        <FormControl className="w-100">
                          {/* <FormLabel id="demo-radio-buttons-group-label">Create Poll</FormLabel> */}
                          <RadioGroup aria-labelledby="demo-radio-buttons-group-label" value={gender} name="gender">
                            <div className="row  mb-0">
                              <div className="col-lg-3" style={{ maxWidth: "23%" }}>
                              <FormControlLabel value="male" control={<Radio />} label="Male" onChange={handleChangeGender} />
                              </div>
                              <div className="col-lg-3 text-end">
                                <FormControlLabel value="female" control={<Radio />} label="Female" onChange={handleChangeGender} />
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </div>

                      
                      <div className="col-lg-12">
                        <label className="title-col">Full Access</label>

                        <FormControl className="w-100">
                          {/* <FormLabel id="demo-radio-buttons-group-label">Create Poll</FormLabel> */}
                          <RadioGroup aria-labelledby="demo-radio-buttons-group-label" value={access} name="create_admin">
                            <div className="row  mb-0">
                              <div className="col-lg-3" style={{ maxWidth: "23%" }}>
                                <FormControlLabel value="1" control={<Radio />} label="Yes"  onChange={handleChangeAccess}/>
                              </div>
                              <div className="col-lg-3 text-end">
                                <FormControlLabel value="0" control={<Radio />} label="No"  onChange={handleChangeAccess}/>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </div>


                    

                      <div className="col-lg-12 mb-4">
                        <label className="title-col">Address <span className="text-blue"></span></label>
                        <TextField id="filled-multiline-static" name='address'  multiline rows={4} fullWidth  variant="filled" autoComplete="off" defaultValue={data.address}/>

                      </div>

                  
                      <div className="col-lg-12 text-end">
                        <Button type='submit' className="mr-3 btn-pd btnBg">Update</Button>
                        
                      </div>

                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="card-footer mb-1">

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


