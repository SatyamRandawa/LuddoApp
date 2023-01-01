const Admin_Model = require("../model/Admin_Model")
const Block_IP = require("../model/block_ips")
const bcrypt = require('bcrypt')
const ip = require('ip');
const jwt = require('jsonwebtoken');
const Doctors_Model = require("../model/Doctors_Model");
const Doctor_category = require("../model/Dr_category")



const add_Admin = async (req, res) => {
    try {

        const data = req.body

        const { name, email, password, lastName, phone, address, country, state, city, postCode } = data;


        if (!email) {
            return res.status(400).send({ status: false, msg: "Please enter name" });
        }

        const saltRounds = 10
        const encryptedPassword = await bcrypt.hash(password, saltRounds)

        console.log("==>", encryptedPassword)

        if (!password) {
            return res.status(400).send({ status: false, msg: "Please enter name" });
        }

        let obj = {
            Firstname: name,
            email: email,
            password: encryptedPassword,
            lastName: lastName,
            phone: phone,
            address: address,
            country: country,
            state: state,
            city: city,
            postCode: postCode,
        }

        let create = await Admin_Model.create(obj)
        return res.status(201).send({ status: true, msg: "data created", data: create });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, error: error });
    }
}



//---------------------------------------------Admin-Login--------------------------------------------------------------------------------


const AdminLogin = async (req, res) => {
    try {

        let email = req.body.email;
        let password = req.body.password;



        if (!email) {
            return res.status(200).send({ 'status': false, 'msg': "enter email" });
        }

        if (!password) {
            return res.status(200).send({ status: false, msg: "enter password" });
        }


        let checkEmail = await Admin_Model.findOne({ email: email });



        if (!checkEmail) {
            return res.status(200).send({ status: false, msg: "Please enter valid information" });
        }

        if (checkEmail.blocked == 1) {
            return res.status(200).send({ status: false, msg: "You are blocked! Please contact to admin" })
        }

        const decryptedPassword = await bcrypt.compare(password, checkEmail.password)


        if (!decryptedPassword) {

            let findAdmindata = await Admin_Model.findOne({ email: email });
            let UserIP = ip.address()
            let adminID = checkEmail._id

            let findLoginTime = Date.now();

            let logData = {
                email: email,
                UserID: findAdmindata._id,
                loginTime: findLoginTime,
                IP: UserIP,
                status: "Please enter valid info",

            }

            let admindata = await Admin_Model.findOne();
            let currStatus = await Admin_Model.findOne({ email: email })
            let wrongCount = currStatus.wrongpassword + 1;
            let update = await Admin_Model.findOneAndUpdate({ email: email }, { wrongpassword: wrongCount })
            let remainingchance = admindata.adminpasswordlimit - update.wrongpassword


            if (update.wrongpassword == admindata.adminpasswordlimit) {
                let UserIP = ip.address()
                let data = {
                    IP: UserIP
                }
                let blockIP = await Block_IP.create(data)
                let update = await Admin_Model.findOneAndUpdate({ email: email }, { wrongpassword: 0 })

                setTimeout(async () => {
                    let UserIP = ip.address()
                    let findIP = await Block_IP.findOneAndDelete({ IP: UserIP })

                }, "10000")

                return res.status(200).send({ status: false, msg: "You are blocked due to access try Please try againn after 10 mintutes" })

            }

            return res.status(200).send({ status: false, msg: `Invalid password remaining chances ${remainingchance}` });
        }

        //---------Login_History-------------//
        let adminID = checkEmail._id

        let findLoginTime = Date.now();

        let findAdmindata = await Admin_Model.findOne({ email: email });

        let UserIP = ip.address()

        let update = await Admin_Model.findOneAndUpdate({ email: email }, { wrongpassword: 0 })
        res.status(200).send({ status: true, 'ID': adminID, msg: "OTP send sucessfully" })
        //-------------------generate-Otp---------------------------------------------------------------//
        let otp = 100000 + Math.floor(Math.random() * 900000);



        let collection = {
            name: checkEmail.name,
            email: checkEmail.email,
            password: checkEmail.password,
            otp: otp,
            createdAt: checkEmail.createdAt,
            updatedAt: checkEmail.updatedAt


        }

        let create = await Admin_Model.findOneAndUpdate({ email: email }, collection)

        const nodemailer = require("nodemailer");

        let ID = adminID.toString();




    } catch (error) {
        console.log(error);
    }
}

//---------------------------------------Verify-User-OTP---------------------------------------------------------------------------------------//

const verifyOTP = async (req, res) => {
    try {

        const OTP = req.body.OTP;
        let admminID = req.params.adminID
        console.log("ID", admminID)

        if (!OTP) {
            return res.status(200).send({ status: false, msg: "Please Enter OTP" })
        }

        let findOTP = await Admin_Model.findOne({ _id: admminID });

        if (!findOTP) {
            return res.status(200).send({ status: false, msg: "User Not Found" })
        }


        if (findOTP.otp != OTP) {

            let admindata = await Admin_Model.findOne();
            let currStatus = await Admin_Model.findOne({ _id: admminID })
            let wrongCount = currStatus.wrongOTP + 1;
            let update = await Admin_Model.findOneAndUpdate({ _id: admminID }, { wrongOTP: wrongCount })
            let remainingchance = admindata.adminotplimit - update.wrongOTP

            if (update.wrongOTP >= admindata.adminotplimit) {
                let UserIP = ip.address()
                let data = {
                    IP: UserIP
                }
                let blockIP = await Block_IP.create(data)
                let update = await Admin_Model.findOneAndUpdate({ _id: admminID }, { wrongOTP: 0 })
                return res.status(200).send({ status: false, msg: "You are blocked due to access try Please contact to our team" })
            }
            return res.status(200).send({ status: false, msg: `Invalid OTP remaining chances ${remainingchance}` })
        }

        let email = findOTP.email
        let name = findOTP.name
        let token = jwt.sign({ name, admminID, email }, 'Admin')

        let update = await Admin_Model.findOneAndUpdate({ _id: admminID }, { wrongOTP: 0 })
        return res.status(200).send({ status: true, token: token, ID: admminID, msg: "OTP Verify Sucessfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}

//---------------------------------------------------view-Doctors-----------------------------------------------------------------------------------------

const View_Dr = async (req, res) => {
    try {

        let pageNO = req.body.page;
        if (pageNO == 0) {
            pageNO = 1
        }
        const { page = pageNO, limit = 10 } = req.query;

        if (Object.keys(req.body).length <= 1) {
            let countpages11 = await Doctors_Model.find({ isDeleted: 0, blocked: 0 });
            let counPages = countpages11.length
            let find_Drs = await Doctors_Model.find({ isDeleted: 0, blocked: 0 }).limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            return res.status(200).send({ status: true, totlaRow: counPages, currenPage: parseInt(pageNO), data: find_Drs })
        } else if (req.body.specialities) {
            let option = [{ specialities: req.body.specialities }]

            let countpages11 = await Doctors_Model.find({ $or: option, isDeleted: 0, blocked: 0 });
            let counPages = countpages11.length
            let find_Drs = await Doctors_Model.find({ $or: option, isDeleted: 0, blocked: 0 }).limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            return res.status(200).send({ status: true, totlaRow: counPages, currenPage: parseInt(pageNO), data: find_Drs })
        }




    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//----------------------------------------------verify-doctor-----------------------------------------------------------------------------------------------

const verify_Dr = async (req, res) => {
    try {

        const Dr_ID = req.params.Dr_ID;

        if (!Dr_ID) {
            return res.status(200).send({ status: false, msg: "Please enter Doctor Id" })
        }

        let verify_Dr = await Doctors_Model.findByIdAndUpdate({ _id: Dr_ID }, { status: "verified" })

        if (verify_Dr) {
            return res.status(200).send({ status: true, msg: "Doctor verify successfully" })

        }

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//--------------------------------------------------pending-doctors----------------------------------------------------------------------------------------

const get_pending_Doctors = async (req, res) => {
    try {

        let pageNO = req.body.page;
        if (pageNO == 0) {
            pageNO = 1
        }
        const { page = pageNO, limit = 10 } = req.query;
        let countpages11 = await Doctors_Model.find({ status: "pending" });
        let counPages = countpages11.length
        let find = await Doctors_Model.find({ status: "pending" }).limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        return res.status(200).send({ status: true, totlaRow: counPages, currenPage: parseInt(pageNO), find })

    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.message })
    }
}

//------------------------------------------------Block-Dr---------------------------------------------------------------------------------------------------

const Dr_block = async (req, res) => {
    try {

        const Dr_ID = req.params.Dr_ID;

        if (!Dr_ID) {
            return res.status(200).send({ status: false, msg: "Please enter " })
        }

        if (Dr_ID.length < 24) {
            return res.status(200).send({ status: false, msg: "Please enter valid ID" })
        }
        let findCust = await Doctors_Model.findByIdAndUpdate({ _id: Dr_ID }, { blocked: 1 })



        return res.status(200).send({ status: true, msg: " Doctor block sucessfully " })


    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.messege })
    }
}
//------------------------------------------------Un_Block-Dr---------------------------------------------------------------------------------------------------

const Dr_Un_block = async (req, res) => {
    try {

        const Dr_ID = req.params.Dr_ID;

        if (!Dr_ID) {
            return res.status(200).send({ status: false, msg: "Please enter " })
        }

        if (Dr_ID.length < 24) {
            return res.status(200).send({ status: false, msg: "Please enter valid ID" })
        }
        let findCust = await Doctors_Model.findByIdAndUpdate({ _id: Dr_ID }, { blocked: 0 })



        return res.status(200).send({ status: true, msg: " Doctor Un block sucessfully " })


    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.messege })
    }
}
//---------------------------------------Dr-blocked-lists------------------------------------------------------------------------------

const Dr_block_list = async (req, res) => {
    try {


        let pageNO = req.body.page;
        if (pageNO == 0) {
            pageNO = 1
        }
        const { page = pageNO, limit = 10 } = req.query;

        let countpages11 = await Doctors_Model.find({ blocked: 1 });
        let counPages = countpages11.length
        let findCust = await Doctors_Model.find({ blocked: 1 }).limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        return res.status(200).send({ status: true, totlaRow: counPages, currenPage: parseInt(pageNO), findCust })


    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.messege })
    }
}

//--------------------------------------------Delete-Drs-----------------------------------------------------------------------------------------------------
const Delete_Dr = async (req, res) => {
    try {

        const Dr_ID = req.params.Dr_ID;

        if (!Dr_ID) {
            return res.status(200).send({ status: false, msg: "Please enter " })
        }

        if (Dr_ID.length < 24) {
            return res.status(200).send({ status: false, msg: "Please enter valid ID" })
        }
        let findCust = await Doctors_Model.findByIdAndUpdate({ _id: Dr_ID }, { isDeleted: 1 })

        if (findCust) {

            return res.status(200).send({ status: true, msg: " Doctor Delete sucessfully " })

        }
    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.messege })
    }
}

//---------------------------------------------add_Dr_cat-------------------------------------------------------------------------------------------------

const add_Dr_cat = async (req, res) => {
    try {


        let array = [
            "Pediatrics",
            "General physician",
            "Epidemic"
        ]
        let add = await Doctor_category.create({ Dr_cat: array })

        return res.status(200).send({ status: true, array })


    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.messege })

    }
}


//------------------------------------------------------------add-dr-category--------------------------------------------------------------------------------

const add_Dr_category = async (req, res) => {
    try {

        let data = req.body.category
        let catID = req.params.catID

       
        let add = await Doctor_category.findOneAndUpdate({_id : catID},{ $push: { "Dr_cat": data } }, {new : true})

        return res.status(200).send({ status: true, mag:"Category add sucessfully", add })


    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: false, msg: error.messege })

    }
}

//--------------------------------------------get_list_of_Dr_category------------------------------------------------------------------------------------

const get_Dr_category_list = async (req, res) => {
    try{

        let get_cat = await Doctor_category.find();
        for(let i of get_cat){
            return res.status(200).send({ status: true, categories :  i.Dr_cat})
        }
        
    }catch(error){
        console.log(error)
        return res.status(200).send({ status: false, msg: error.messege })

    }
}


module.exports = {
    add_Admin, AdminLogin, verifyOTP, View_Dr, verify_Dr,
    get_pending_Doctors, Dr_block, Dr_block_list, Delete_Dr,
    Dr_Un_block, add_Dr_cat , add_Dr_category, get_Dr_category_list
}



