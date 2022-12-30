const express = require('express');
const router = express.Router();

const adminController=require('../Controller/adminController')

router.post("/createAdmin",adminController.createAdmin);
router.post("/admin_login",adminController.admin_login);
router.post("/changepassword",adminController.admin_changepassword);
router.get("/viewAdmin/:id?",adminController.viewAdmin);
router.put("/updateAdmin/:id?",adminController.updateAdmin);
router.delete("/deleteAdmin/:id?",adminController.deleteAdmin);
module.exports = router;
