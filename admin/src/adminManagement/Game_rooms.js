import React from "react";
import Header from "../Header";
import { Link, Navigate, NavLink } from "react-router-dom";
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
import TableListComponent from "./TableListComponent";
import { useState, useEffect } from "react";
function Game_Rooms() {

    const [data, setData] = useState([])

    const room_list = async () => {
        await axios.get(`/game_list_react`)
            .then(res => {
                let data = res.data.msg
                setData(data)
                console.log("pushpa jhukega nahi", data)
            })
    }
    useEffect(() => {
        room_list()
    }, [])
    return (


        <>
          <Header />
            <div className="main-content side-content pt-0">
                <div className="container-fluid">
                    <div className="inner-body">
                        <div className="page-header">
                            <div>
                                <h2 className="main-content-title tx-24 mg-b-5">Rooms List</h2>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/admin">Admin</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">&nbsp;&nbsp;Rooms Management</li>
                                </ol>
                            </div>
                            <div className="d-flex">
								<div className="justify-content-center">
                                <Link to="/Admin/create" className="btn-link">
                                <i className="fas fa-plus"></i>&nbsp;&nbsp; Enter In Rooms
                                </Link>
                               
                                </div>
							</div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 table-responsive border border-bottom-0">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="table-card MuiPaper-root MuiPaper-elevation2 MuiPaper-rounded">
                                            <h6 className="MuiTypography-root MuiTypography-h6 padd1rem">Admin List</h6>
                                            <table className="table ">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Index</th>
                                                        <th scope="col">gameID</th>
                                                        <th scope="col">Game Time</th>
                                                        <th scope="col"> <span className="Chal_be"> Player ID</span> </th>
                                                        <th scope="col">Player Name</th>
                                                        <th scope="col" > <span className="Chal_be"> Room's</span>    </th>


                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data == '' ? <>
                                                        <tr>
                                                            <td className="text-center" colSpan='9'>
                                                                <img src="/assets/images/nodatafound.png" alt='no image' width="350px" /> </td>
                                                        </tr>
                                                    </> : null}
                                                    {data.map((item, index) => {
                                                        return (
                                                            <tr key={"yhgfh"}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.gameID}</td>
                                                                <td>{Moment(item.game_time).format("DD/MM/YYYY")}</td>
                                                                <td>{item.Player_ID}</td>
                                                                <td>{item.player_name}</td>
                                                                <td>  <Button type="button" className="btn-link btn_handler"> <a href={` ${item.Url}`} target="_blank" >Enter In Room</a> </Button> </td>
                                                            </tr>
                                                        );


                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* <div className="col-lg-12 mt-2 text-end">
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
                    </div> */}
                                    </div>
                                    <div>
                                    </div>
                                </div>      
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Game_Rooms;