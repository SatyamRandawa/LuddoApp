const Doctor_Model = require("../model/Doctors_Model")
const Doctor_Doc = require("../model/Doctors_Doc")
const imageToBase64 = require('image-to-base64');
const nodemailer = require('nodemailer')
const { uploadFile } = require("../aws/aws.js");
const bcrypt = require('bcrypt')
const BlockIP = require("../model/block_ips")
const adminModel = require("../model/Admin_Model")
const ip = require('ip');
const jwt = require("jsonwebtoken")
const Appoitment_Model = require("../model/appoitment")




//----------------------------------------------------generate-password--------------------------------------------------------------------------
function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


//---------------------------------------------------Create-doctors------------------------------------------------------------------------------
const Create_Doctors = async (req, res) => {
    try {

        const data = req.body;
        const files = req.files;



        const { firstName, lastName, city, postCode, state, email, phone, hospital_address, Latitude, Longitude } = data

        if (files.length == 0) {
            return res.status(200).send({ status: false, msg: "Please fill the image fields" })

        }

        if (!firstName) {
            return res.status(200).send({ status: false, msg: "Please fill the all fields" })
        }

        if (!lastName) {
            return res.status(200).send({ status: false, msg: "Please fill the all fields" })
        }

        if (!city) {
            return res.status(200).send({ status: false, msg: "Please fill the all fields" })
        }

        if (!hospital_address) {
            return res.status(200).send({ status: false, msg: "Please fill the all fields" })
        }

        if (!email) {
            return res.status(200).send({ status: false, msg: "Please fill the all fields" })
        }

        if (!phone) {
            return res.status(200).send({ status: false, msg: "Please fill the all fields" })
        }

        if (!postCode) {
            return res.status(200).send({ status: false, msg: "Please fill the all fields" })
        }


        let AgentPass = generatePassword()
        const saltRounds = 10
        const encryptedPassword = await bcrypt.hash(AgentPass, saltRounds)
        const profilePicture = await uploadFile(files[0])

        let obj = {
            image: profilePicture,
            firstName: firstName,
            lastName: lastName,
            city: city,
            postCode: postCode,
            state: state,
            email: email,
            phone: phone,
            hospital_address: hospital_address,
            password: encryptedPassword
        }



        let create = await Doctor_Model.create(obj)

        const sentEmail = async (req, res) => {

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'chrmepay123@gmail.com',
                    pass: 'jgiplcgrbddvktkl',
                }
            });


            var mailOptions = {
                from: 'chrmepay123@gmail.com',
                to: 'satyamrandwa141@gmail.com',
                subject: 'Agent Register',
                text: `Hello Dr.${firstName}! congratulation now you are part of AurMedic family, your username ${email} & your password ${AgentPass}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('email error line 34 ===', error);
                    return false;
                } else {
                    console.log('Email sent: ' + info.messageId);
                    return info.messageId;
                }
            });
        }
        sentEmail();

        return res.status(201).send({ status: true, msg: "Doctor register succesfully" })



    } catch (error) {
        console.log(error)
    }
}

//-------------------------------------upload-Doctor-documents-----------------------------------------------------------------------------------------------

const Upload_Dr_Doc = async (req, res) => {
    try {

        const Provisional = req.files
        const Medical_License = req.files
        const Aadhar_Card = req.files
        const Pen_Card = req.files
        const Experience_Certificate = req.files
        const Dr_ID = req.params.Dr_ID

        if (!Dr_ID) {
            return res.status(200).send({ status: false, msg: "Please enter Dr. ID" })
        }

        if (req.files.length < 5) {
            return res.status(200).send({ status: false, msg: "Please Upload All Documents" })
        }

        const ProvisionalUrl = await uploadFile(Provisional[0])
        const Medical_LicenseUrl = await uploadFile(Medical_License[0])
        const Aadhar_CardUrl = await uploadFile(Aadhar_Card[0])
        const Pen_CardUrl = await uploadFile(Pen_Card[0])
        const Experience_CertificateUrl = await uploadFile(Experience_Certificate[0])

        let obj = {
            Doctor_ID: Dr_ID,
            Provisional: ProvisionalUrl,
            Medical_License: Medical_LicenseUrl,
            Aadhar_Card: Aadhar_CardUrl,
            Pen_Card: Pen_CardUrl,
            Experience_Certificate: Experience_CertificateUrl

        }

        let create = await Doctor_Doc.create(obj)

        if (create) {
            let update_Doc = await Doctor_Model.findByIdAndUpdate({ _id: Dr_ID }, { Documents: 1 })
            return res.status(200).send({ status: false, msg: "Document's Uploaded Sucessfully" })
        }

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//---------------------------------------------Login-doctors----------------------------------------------------------------------------------------------

const Login_Dr = async (req, res) => {
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

            let find_Dr = await Doctor_Model.findOne({ email: username })



            if (!find_Dr) {
                return res.status(200).send({ status: false, msg: "Please enter register email" })
            }

            console.log("pass", find_Dr.password)

            if (find_Dr) {
                const decryptedPassword = await bcrypt.compare(password, find_Dr.password)
                console.log(decryptedPassword)

                if (!decryptedPassword) {
                    let UserIP = ip.address()
                    let findLoginTime = Date.now();
                    let logData = {
                        email: find_Dr.email,
                        UserID: find_Dr._id,
                        loginTime: findLoginTime,
                        IP: UserIP,
                        status: "Please enter valid password",
                    }
                    let admindata = await adminModel.findOne();
                    let currStatus = await Doctor_Model.findOne({ email: username })

                    let wrongCount = currStatus.wrongpassword + 1;

                    let update = await Doctor_Model.findOneAndUpdate({ email: username }, { wrongpassword: wrongCount })
                    let remainingchance = admindata.Doctorpasswordlimit - update.wrongpassword

                    if (update.wrongpassword >= admindata.Doctorpasswordlimit) {
                        let UserIP = ip.address()
                        let data = {
                            IP: UserIP
                        }
                        let blockIP = await BlockIP.create(data)
                        let update = await Doctor_Model.findOneAndUpdate({ email: find_Dr.email }, { wrongpassword: 0 })

                        setTimeout(async () => {
                            let UserIP = ip.address()
                            let findIP = await BlockIP.findOneAndDelete({ IP: UserIP })

                        }, "10000")

                        return res.status(200).send({ status: false, msg: "You are blocked due to access try Please try againn after 10 mintutes" })

                    }

                    return res.status(200).send({ status: false, msg: `Invalid password remaining chances ${remainingchance}` });
                }

                let Dr_ID = find_Dr._id;
                let Dr_email = find_Dr.email
                let token = jwt.sign({ Dr_ID, Dr_email }, 'Doctor')
                return res.status(200).send({ status: true, msg: "Login Sucessfully", token })

            }

        } else {
            let find_Dr = await Doctor_Model.findOne({ phone: username })

            if (!find_Dr) {
                return res.status(200).send({ status: false, msg: "Please enter register phone" })
            }

            if (find_Dr) {
                const decryptedPassword = await bcrypt.compare(password, find_Dr.password)
                console.log(decryptedPassword)

                if (!decryptedPassword) {
                    let UserIP = ip.address()
                    let findLoginTime = Date.now();
                    let logData = {
                        email: find_Dr.email,
                        UserID: find_Dr._id,
                        loginTime: findLoginTime,
                        IP: UserIP,
                        status: "Please enter valid password",
                    }
                    let admindata = await adminModel.findOne();
                    let currStatus = await Doctor_Model.findOne({ phone: username })

                    let wrongCount = currStatus.wrongpassword + 1;

                    let update = await Doctor_Model.findOneAndUpdate({ phone: username }, { wrongpassword: wrongCount })
                    let remainingchance = admindata.Doctorpasswordlimit - update.wrongpassword

                    if (update.wrongpassword >= admindata.Doctorpasswordlimit) {
                        let UserIP = ip.address()
                        let data = {
                            IP: UserIP
                        }
                        let blockIP = await BlockIP.create(data)
                        let update = await Doctor_Model.findOneAndUpdate({ phone: find_Dr.email }, { wrongpassword: 0 })

                        setTimeout(async () => {
                            let UserIP = ip.address()
                            let findIP = await BlockIP.findOneAndDelete({ IP: UserIP })

                        }, "10000")

                        return res.status(200).send({ status: false, msg: "You are blocked due to access try Please try againn after 10 mintutes" })

                    }

                    return res.status(200).send({ status: false, msg: `Invalid password remaining chances ${remainingchance}` });
                }

                let Dr_ID = find_Dr._id;
                let Dr_email = find_Dr.email
                let token = jwt.sign({ Dr_ID, Dr_email }, 'Doctor')
                return res.status(200).send({ status: true, msg: "Login Sucessfully", token })

            }
        }
    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//--------------------------get-today-aapoitments-----------------------------------------------------------------------------------------------------------

const get_today_aapoitments = async (req, res) => {
    try {


        const Dr_ID = req.Dr_ID;

         if(!Dr_ID){
            return res.status(200).send({status : false, msg:"Please enter Doctor ID"})
         }

         let date = new Date();
         let year = date.getFullYear();
         let months = date.getMonth() + 1;
         let day = date.getDate();
         let today_date = `${day}-${months}-${year}`
         let find_data = await Appoitment_Model.find({date : today_date, isBooked : true }).populate("userID")
         console.log("ertyuiouytrewrtyui",`${day}-${months}-${year}`)
         return res.status(200).send({ status: true,  find_data})


    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

module.exports = { Create_Doctors, Upload_Dr_Doc, Login_Dr, get_today_aapoitments }