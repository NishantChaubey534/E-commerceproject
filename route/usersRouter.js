const express = require('express');

const userModel = require("../models/user-model")
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} =require("../utils/generateToken");
const {registerUser,loginUser,logoutUser} =require("../controllers/authControllers")
const isLoggedIn= require("../middleware/isLoggedIn");  


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);




module.exports = router;