const user_model = require("../model/user_Model")
const bcrypt = require('bcrypt')
const BlockIP = require("../model/block_ips")
const adminModel = require("../model/Admin_Model")
const ip = require('ip');
const jwt = require("jsonwebtoken")
const { uploadFile } = require("../aws/aws.js");
const Doctors_Model = require("../model/Doctors_Model");
const appointment_model = require("../model/appoitment");
const { create } = require("../model/Doctors_Model");


const Register_user = async (req, res) => {
    try {

        const data = req.body;
        const image = req.files
        const { First_name, Last_name, email, phone, Date_Of_Birth, age, Latitude, Longitude, address, password, confirmPassword } = data

        if (!First_name) {
            return res.status(200).send({ 'status': false, msg: " Please enter First name" });
        }

        if (!Last_name) {
            return res.status(200).send({ 'status': false, msg: " Please enter Last name" });
        }

        if (!email) {
            return res.status(200).send({ 'status': false, msg: " Please enter email" });
        }

        let checkEmail = await user_model.findOne({ email: email })

        if (checkEmail) {
            return res.status(200).send({ 'status': false, msg: "Email already Register" });
        }

        if (!phone) {
            return res.status(200).send({ 'status': false, msg: " Please enter phone Number" });
        }

        let checkPhone = await user_model.findOne({ phone: phone })

        if (checkPhone) {
            return res.status(200).send({ 'status': false, msg: "phone already Register" });
        }

        if (!Date_Of_Birth) {
            return res.status(200).send({ 'status': false, msg: " Please enter Date_Of_Birth" });
        }

        if (!age) {
            return res.status(200).send({ 'status': false, msg: " Please enter age" });
        }

        if (!address) {
            return res.status(200).send({ 'status': false, msg: " Please enter address" });
        }

        if (!password) {
            return res.status(200).send({ 'status': false, msg: " Please enter password" });
        }

        if (!confirmPassword) {
            return res.status(200).send({ 'status': false, msg: " Please enter confirm password" });
        }

        if (password !== confirmPassword) {
            return res.status(200).send({ status: false, msg: "Confirm Password mismatch" })
        }

        if (password.length < 8) {
            return res.status(200).send({ status: false, msg: "Password length should be more than 8 " })
        }


        const saltRounds = 10
        const encryptedPassword = await bcrypt.hash(password, saltRounds)
        let profile_picture = await uploadFile(image[0])

        let obj = {
            image: profile_picture,
            First_name: First_name,
            Last_name: Last_name,
            email: email,
            phone: phone,
            Date_Of_Birth: Date_Of_Birth,
            age: age,
            Latitude: Latitude,
            Longitude: Longitude,
            address: address,
            password: encryptedPassword
        }

        let create = await user_model.create(obj)

        if (create) {
            return res.status(200).send({ status: true, msg: "Registration done sucessfully" })
        } else {
            return res.status(200).send({ status: true, msg: "Failed please try again" })
        }

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}


//-----------------------------------------------Login_user---------------------------------------------------------------------------------------------

const Login_user = async (req, res) => {
    try {

        const data = req.body;
        const { username, password } = data

        if (!username) {
            return res.status(200).send({ status: false, msg: "Please enter email or phone number" })
        }

        if (!password) {
            return res.status(200).send({ status: false, msg: "Please enter pasword" })
        }


        if ((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(username)) {

            let find_user = await user_model.findOne({ email: username })



            if (!find_user) {
                return res.status(200).send({ status: false, msg: "Please enter register email" })
            }

            console.log("pass", find_user.password)

            if (find_user) {
                const decryptedPassword = await bcrypt.compare(password, find_user.password)


                if (!decryptedPassword) {
                    let UserIP = ip.address()
                    let findLoginTime = Date.now();
                    let logData = {
                        email: find_user.email,
                        UserID: find_user._id,
                        loginTime: findLoginTime,
                        IP: UserIP,
                        status: "Please enter valid password",
                    }
                    let admindata = await adminModel.findOne();
                    let currStatus = await user_model.findOne({ email: username })

                    let wrongCount = currStatus.wrongpassword + 1;

                    let update = await user_model.findOneAndUpdate({ email: username }, { wrongpassword: wrongCount })
                    let remainingchance = admindata.Doctorpasswordlimit - update.wrongpassword

                    if (update.wrongpassword >= admindata.Doctorpasswordlimit) {
                        let UserIP = ip.address()
                        let data = {
                            IP: UserIP
                        }
                        let blockIP = await BlockIP.create(data)
                        let update = await user_model.findOneAndUpdate({ email: find_user.email }, { wrongpassword: 0 })

                        setTimeout(async () => {
                            let UserIP = ip.address()
                            let findIP = await BlockIP.findOneAndDelete({ IP: UserIP })

                        }, "10000")

                        return res.status(200).send({ status: false, msg: "You are blocked due to access try Please try againn after 10 mintutes" })

                    }

                    return res.status(200).send({ status: false, msg: `Invalid password remaining chances ${remainingchance}` });
                }

                let User_ID = find_user._id;
                let User_email = find_user.email
                let token = jwt.sign({ User_ID, User_email }, 'User')
                return res.status(200).send({ status: true, msg: "Login Sucessfully", token })

            }

        } else {
            let find_user = await user_model.findOne({ phone: username })

            if (!find_user) {
                return res.status(200).send({ status: false, msg: "Please enter register phone" })
            }

            if (find_user) {
                const decryptedPassword = await bcrypt.compare(password, find_user.password)
                console.log(decryptedPassword)

                if (!decryptedPassword) {
                    let UserIP = ip.address()
                    let findLoginTime = Date.now();
                    let logData = {
                        email: find_user.email,
                        UserID: find_user._id,
                        loginTime: findLoginTime,
                        IP: UserIP,
                        status: "Please enter valid password",
                    }
                    let admindata = await adminModel.findOne();
                    let currStatus = await user_model.findOne({ phone: username })

                    let wrongCount = currStatus.wrongpassword + 1;

                    let update = await user_model.findOneAndUpdate({ phone: username }, { wrongpassword: wrongCount })
                    let remainingchance = admindata.Doctorpasswordlimit - update.wrongpassword

                    if (update.wrongpassword >= admindata.Doctorpasswordlimit) {
                        let UserIP = ip.address()
                        let data = {
                            IP: UserIP
                        }
                        let blockIP = await BlockIP.create(data)
                        let update = await user_model.findOneAndUpdate({ phone: find_user.email }, { wrongpassword: 0 })

                        setTimeout(async () => {
                            let UserIP = ip.address()
                            let findIP = await BlockIP.findOneAndDelete({ IP: UserIP })

                        }, "10000")

                        return res.status(200).send({ status: false, msg: "You are blocked due to access try Please try againn after 10 mintutes" })

                    }

                    return res.status(200).send({ status: false, msg: `Invalid password remaining chances ${remainingchance}` });
                }

                let User_ID = find_user._id;
                let User_email = find_user.email
                let token = jwt.sign({ User_ID, User_email }, 'User')
                return res.status(200).send({ status: true, msg: "Login Sucessfully", token })

            }
        }
    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//-------------------------------------------------------user_dash_board---------------------------------------------------------------------------------

const user_dash_board = async (req, res) => {
    try {

        const userID = req.userId;

        let find_user = await user_model.findById({ _id: userID })

        return res.status(200).send({ status: true, find_user })



    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//--------------------------------------doctor_view---------------------------------------------------------------------------------------------------------

const Doctor_view = async (req, res) => {
    try {

        const Doctor_Id = req.params.Dr_ID;

        if (!Doctor_Id) {
            return res.status(200).send({ status: false, msg: "Please enter Doctor ID" })
        }

        let find_Dr = await Doctors_Model.findOne({ _id: Doctor_Id })

        return res.status(200).send({ status: true, find_Dr })

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//---------------------------------------------Book_Slot-------------------------------------------------------------------------------------------------

const Book_slot = async (req, res) => {
    try {

        const userID = req.userId;
        console.log("userID", userID)
        const Dr_ID = req.body.Dr_ID;
        const slot = req.body.slot_time;
        const date = req.body.date

        if (!Dr_ID) {
            return res.status(200).send({ status: false, msg: "Please enter Doctor ID" })
        }

        let obj = {
            userID: userID,
            Doctor_ID: Dr_ID,
            slot_time: slot,
            date: date
        }

        let create = await appointment_model.create(obj)

        if (create) {
            return res.status(200).send({ status: true, msg: "Book Slot Sucessfully" })
        }

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//----------------------------------------get-user-booked-appoitment-------------------------------------------------------------------------------------

const get_today_appoitment_slot = async (req, res) => {

    try {
        const userID = req.userId;
        if (!userID) {
            return res.status(200).send({ status: false, msg: "Please enter userId" })
        }

        let date = new Date();

        let today_date = date.getDate();
        let curr_month = date.getMonth() + 1;
        let curr_year = date.getFullYear();

        let final_date = `${today_date}-${curr_month}-${curr_year}`
        let find = await appointment_model.find({ userID: userID, date: final_date })

        return res.status(200).send({ status: true, find })

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })

    }
}



module.exports = {
    Register_user, Login_user, user_dash_board, Doctor_view, Book_slot,
    get_today_appoitment_slot
}