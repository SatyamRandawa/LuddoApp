const express = require('express');
const router = express.Router();
const {image_upload}=require('../helper/image_helper');

const userController=require('../Controller/userController');

const userImageUpload=image_upload('./assets/user_img','image')

router.post("/register",userImageUpload,userController.user_register);
router.get("/viewUser", userController.viewUser)

module.exports = router;
