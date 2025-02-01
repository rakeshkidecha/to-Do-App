const express = require('express');
const UserCtl = require('../controller/UserCtl');
const User = require('../models/UserModel');
const router = express.Router();

// user login-
router.get('/',UserCtl.login);

router.post('/checkLogin',UserCtl.checkLogin);

// user sign up 
router.get('/signUp',UserCtl.signUp);

router.post('/insertUser',User.uploadProfileImage,UserCtl.insertUser);

// logout 
router.get('/logout',UserCtl.logout);


module.exports = router;