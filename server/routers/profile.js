
const express = require('express');
const router = express.Router();

const meProfilecontroller = require('../controllers/profile');
const {AuthMiddleware} = require('../helper/JWT');
//router.post("/", meProfilecontroller.verifySignIn);
router.get("/MyProfile",meProfilecontroller.Profile);
router.post("/update-profile",meProfilecontroller.updateProfileData)
router.post("/add-shift",AuthMiddleware ,meProfilecontroller.addShift)
router.post("/update-shift",AuthMiddleware ,meProfilecontroller.updateShift)
router.post("/delete-shift",AuthMiddleware ,meProfilecontroller.deleteShift)
router.post("/change-password",AuthMiddleware,meProfilecontroller.changePassword )
module.exports = router;