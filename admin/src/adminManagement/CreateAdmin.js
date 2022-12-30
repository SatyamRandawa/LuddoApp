import React from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
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
import { useNavigate } from 'react-router-dom';
import InputEmoji from 'react-input-emoji'

export default function CreateAdmin(props) {

///////////////emoji input value get
  const [answerOne, setAnswerOne] = useState('');
  const [answerTwo, setAnswerTwo] = useState('');
  const [answerThree, setAnswerThree] = useState('');
  const [answerFour, setAnswerFour] = useState('');
  const [answerFive, setAnswerFive] = useState('');
///////////////emoji input value get
  const [answerOneAra, setAnswerOneAra] = useState('');
  const [answerTwoAra, setAnswerTwoAra] = useState('');
  const [answerThreeAra, setAnswerThreeAra] = useState('');
  const [answerFourAra, setAnswerFourAra] = useState('');
  const [answerFiveAra, setAnswerFiveAra] = useState('');
/////////////// emoji input value get

  const navigate = useNavigate();
  const [showhide, setShowhide] = useState('Free');
  const [npshow, setNpshow] = useState('');
  const [show, setShow] = useState('');

  const handleshowhide = (event) => {
    const getuser = event.target.value;
    setShowhide(getuser);
  }

  // const [f_type, setF_type] = React.useState('Free');
  // const handleChangef_type = (event) => { setF_type(event.target.value); }

  // console.log('fee_type === ', showhide);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const [match, setMatch] = React.useState('')
  const [rewards, setRewards] = React.useState('');

  const handleChangerewards = (event) => {
    setRewards(event.target.value);
  };

  const handleChange = (event) => {
    setMatch(event.target.value);
  };


 
  const [gender, setGender] = React.useState('male');
  const handleChangeGender = (event) => { setGender(event.target.value); }

  const [access, setAccess] = React.useState('0');
  const handleChangeAccess = (event) => { setAccess(event.target.value); }
  

  const myFormData = async (e) => {
    e.preventDefault();

    try {

      const data = new FormData(e.target);
      let Formvlaues = Object.fromEntries(data.entries());
      console.log("form data is == ", Formvlaues);
      
  
      let response = await axios.post('/web_api/createAdmin', Formvlaues);
      console.log('my fun call', response);
      if (response.status) {
        let data = response.data;
        if (data.status) {
          // navigate(`/poll`);
          toast.success(data.msg);
        } else {
          toast.error('Please fill all fields before Submit');
        }
      }
      else {
        toast.error('Please fill all fields before Submit');
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
                <h2 className="main-content-title tx-24 mg-b-5">Create Admin</h2>
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
                              <TextField id="filled-multiline-static" name='name' label="Enter Name" multiline rows={1} fullWidth defaultValue="" variant="filled" autoComplete="off" />

                            </div>
                      
                            <div className="col-lg-12 mb-4">
                              <label className="title-col">Email <span className="text-blue"></span></label>
                              <TextField id="filled-multiline-static" name='email' label="Enter Email" multiline rows={1} fullWidth defaultValue="" variant="filled" autoComplete="off" />

                            </div>
                            <div className="col-lg-12 mb-4">
                              <label className="title-col">Mobile <span className="text-blue"></span></label>
                              <TextField id="filled-multiline-static" name='mobile' label="Enter Mobile" multiline rows={1} fullWidth defaultValue="" variant="filled" autoComplete="off" />

                            </div>
                            <div className="col-lg-12 mb-4">
                              <label className="title-col">Password <span className="text-blue"></span></label>
                              <TextField id="filled-multiline-static" name='password' label="Enter Password" multiline rows={1} fullWidth defaultValue="" variant="filled" autoComplete="off" />

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
                                      <FormControlLabel value="1" control={<Radio />} label="Yes" onChange={handleChangeAccess} />
                                    </div>
                                    <div className="col-lg-3 text-end">
                                      <FormControlLabel value="0" control={<Radio />} label="No" onChange={handleChangeAccess} />
                                    </div>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                            </div>


                          

                            <div className="col-lg-12 mb-4">
                              <label className="title-col">Address <span className="text-blue"></span></label>
                              <TextField id="filled-multiline-static" name='address' label="Enter Address" multiline rows={4} fullWidth defaultValue="" variant="filled" autoComplete="off" />

                            </div>

                        
                            <div className="col-lg-12 text-end">
                              <Button type='submit' className="mr-3 btn-pd btnBg">Submit</Button>
                              <Button type='reset' variant="contained" className="btn btn-dark btn-pd">Reset</Button>
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


