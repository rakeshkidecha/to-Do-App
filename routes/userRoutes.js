const express = require('express');
const UserCtl = require('../controller/UserCtl');
const User = require('../models/UserModel');
const {check} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');

// user login-
router.get('/',UserCtl.login);

router.post('/checkLogin',UserCtl.checkLogin);

// user sign up 
router.get('/signUp',UserCtl.signUp);

router.post('/insertUser',User.uploadProfileImage,[
    check('fName').notEmpty().withMessage('First Name is required').isLength({min:2}).withMessage("First Name is Require Minmum 2 Carector of length"),
    check('lName').notEmpty().withMessage('Last Name is required').isLength({min:2}).withMessage("Last Name is Require Minmum 2 Carector of length"),
    check('email').notEmpty().withMessage('Email is Required').isEmail().withMessage("Invalid Imail").custom(async value=>{
        const isExistEmail = await User.findOne({email:value});
        if(isExistEmail){
            throw new Error('This Email is Already Exist');
        }
    }),
    check('password').notEmpty().withMessage("Password Are Required").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'),
    check('confirmPassword').notEmpty().withMessage("Confirm Password Are Required").custom(async (value,{req})=>{
        if(value != req.body.password){
            throw new Error('Password and Confirm Password are not match');
        }
    })
],UserCtl.insertUser);

// logout 
router.get('/logout',UserCtl.logout);

// chnage password 
router.get('/chnagePassword',UserCtl.chnagePassword);
router.post('/checkChangePassword',[
    check('oldPassword').notEmpty().withMessage("Old Password is Required").custom(async (value,{req})=>{
        const isExistUser = await User.findById(req.body.id)
        if(!await bcrypt.compare(value,isExistUser.password)){
            throw new Error('Old Password is not match');
        }
    }),
    check('newPassword').notEmpty().withMessage("New Password is required").custom(async (value,{req})=>{
        if(value == req.body.oldPassword){
            throw new Error('Old and New Password are same');
        }
    }),
    check('confirmPassword').notEmpty().withMessage("Confirm Password is required").custom(async (value,{req})=>{
        if(value != req.body.newPassword){
            throw new Error('New and Confirm Password are not Match');
        }
    }),
],UserCtl.checkChangePassword);

//forget password
router.get('/checkEmail',async (req,res)=>{
    try {
        return res.render('users/checkEmail');
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
});

router.post('/verifyEmail',UserCtl.verifyEmail);

router.get('/checkOtp',UserCtl.checkOtp);

router.post('/verifyOtp',UserCtl.verifyOtp);

router.get('/forgetPassword',UserCtl.forgetPassword);

router.post('/checkPassword',[
    check('newPassword').notEmpty().withMessage("New Password is Required"),
    check('confirmPassword').notEmpty().withMessage("Confirm Password is Required").custom(async (value,{req})=>{
        if(value != req.body.newPassword){
            throw new Error('New and Confirm Password are not Match');
        }
    })
],UserCtl.checkPassword);


module.exports = router;