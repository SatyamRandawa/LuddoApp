const express = require('express');
const router = express.Router();
const adminController = require("../controller/AdminController")
const Doctor_Controller = require("../controller/Doctors")
const {image_upload}=require('../helper/image_helper');
//const image = require('../Images')
const userImageUpload=image_upload('../Images','image')
const Doctor_auth = require("../middleware/Doctors_auth")







router.post("/admin_Crate", adminController.add_Admin)
router.post("/Login_admin", adminController.AdminLogin)
router.post("/Verify_OTP/:adminID", adminController.verifyOTP)
router.post("/Create_Doctors", Doctor_Controller.Create_Doctors)
router.post("/upload_doc/:Dr_ID", Doctor_Controller.Upload_Dr_Doc)
router.post("/View_Dr", adminController.View_Dr)
router.put("/verify_Dr/:Dr_ID", adminController.verify_Dr)
router.get("/get_pending_Doctors", adminController.get_pending_Doctors)
router.post("/Dr_block/:Dr_ID", adminController.Dr_block)
router.post("/Dr_Un_block/:Dr_ID", adminController.Dr_Un_block)
router.get("/Dr_block_list", adminController.Dr_block_list)
router.post("/Delete_Dr/:Dr_ID", adminController.Delete_Dr)
router.post('/add_Dr_cat', adminController.add_Dr_cat)
router.post("/add_Dr_category/:catID", adminController.add_Dr_category)
router.get("/get_Dr_category_list", adminController.get_Dr_category_list)
//------------------------------------Doctors-routes---------------------------------------------------------------------------------------

router.post("/Login_Dr", Doctor_Controller.Login_Dr)
router.get("/get_today_aapoitments/:token",Doctor_auth.auth, Doctor_Controller.get_today_aapoitments )

//------------------------------------users----------------------------------------------------------------------------------------------








module.exports = router 