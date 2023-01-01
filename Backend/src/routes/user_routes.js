const express = require('express');
const router = express.Router();
const User_controller = require("../controller/user")
const user_auth = require("../middleware/customer_auth")



router.post("/Register_user", User_controller.Register_user)
router.post('/Login_user', User_controller.Login_user)
router.get("/user_dash_board/:token", user_auth.auth,  User_controller.user_dash_board)
router.get("/Doctor_view/:Dr_ID", User_controller.Doctor_view )
router.post("/Book_slot/:token",user_auth.auth, User_controller.Book_slot)
router.post("/get_today_appoitment_slot/:token", user_auth.auth, User_controller.get_today_appoitment_slot)

module.exports = router