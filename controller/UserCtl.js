const User = require("../models/UserModel");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('SecretKeydfhkdi8df');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const nodemailer = require("nodemailer");

module.exports.login = async(req,res)=>{
    try {
        if(req.cookies.user){
            return res.redirect('/home');
        }else{
            return res.render('users/logIn');
        }
    } catch (err) {
        console.log("SOmething Wrong",err)
        return res.redirect('back')
    }
}

module.exports.checkLogin = async(req,res)=>{
    try {
        const existUser = await User.findOne({email:req.body.email});

        if(existUser){
            if(await bcrypt.compare(req.body.password,existUser.password)){
                const encryptUserData = cryptr.encrypt(JSON.stringify(existUser))
                res.cookie('user',encryptUserData)
                return res.redirect('/home');
            }else{
                console.log("Invalid Password");
                return res.redirect('back');
            }
        }else{
            console.log("Invalid Email..");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("SOmething Wrong",err)
        return res.redirect('back')
    }
}

module.exports.signUp = async(req,res)=>{
    try {
        if(req.cookies.user){
            return res.redirect('/home');
        }else{
            return res.render('users/signUp',{
                errors:null,
                oldValue:null
            });
        }
    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('/signUp')
    }
}

module.exports.insertUser = async(req,res)=>{
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped());
            if(req.cookies.user){
                return res.redirect('/home');
            }else{
                return res.render('users/signUp',{
                    errors:errors.mapped(),
                    oldValue:req.body
                });
            }
        }

        var imagePath = '';
        if(req.file){
            imagePath = User.imgPath+'/'+req.file.filename
        }

        req.body.profile_image = imagePath;
        req.body.name = req.body.fName+' '+req.body.lName;
        req.body.password = await bcrypt.hash(req.body.password,10);

        const addedUser = await User.create(req.body);

        if(addedUser){
            const encryptUserData = cryptr.encrypt(JSON.stringify(addedUser))
            res.cookie('user',encryptUserData)
            console.log("Account Create SuccessFully");
            return res.redirect('/home');
        }else{
            console.log("Account Create Failed");
            return res.redirect('/signUp')
        }


    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('/signUp')
    }
}

module.exports.logout = async(req,res)=>{
    try {
        res.clearCookie('user');
        return res.redirect('/');
    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('back')
    }
};

module.exports.chnagePassword = async(req,res)=>{
    try {
        const user = JSON.parse(cryptr.decrypt(req.cookies.user))
        if(!user){
            return res.redirect('/')
        }
        return res.render('users/changePassword',{user,errors:null,oldValue:null});

    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('back')
    }
};

module.exports.checkChangePassword = async(req,res)=>{
    try {
        const errors = validationResult(req);
        const user = JSON.parse(cryptr.decrypt(req.cookies.user));
        if(!errors.isEmpty()){
            return res.render('users/changePassword',{user,errors:errors.mapped(),oldValue:req.body})
        };
        const isExistUser = await User.findById(user._id);
        if(isExistUser){
            const newPass = await bcrypt.hash(req.body.newPassword,10);
            const updatePass = await User.findByIdAndUpdate(isExistUser._id,{password:newPass});
            if(updatePass){
                console.log("Password Change successfully");
                res.clearCookie('user');
                return res.redirect('/')
            }else{
                console.log("Password not Updated");
                return res.redirect('/changePassword')
            }
        }else{
            console.log("User not found")
            return res.redirect('/changePassword')
        }

    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('/changePassword')
    }
}

module.exports.verifyEmail = async(req,res)=>{
    try {
        const isExistUser = await User.findOne({email:req.body.email});
        if(isExistUser){

            const OTP = Math.ceil(Math.random()*10000);

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "workrakesh04@gmail.com",
                  pass: "onmmfbnogttrtzui",
                },
            });

            const info = await transporter.sendMail({
                from: 'workrakesh04@gmail.com', // sender address
                to: isExistUser.email, // list of receivers
                subject: "Verify Otp", // plain text body
                html: `<p>your OTP For forget password is <b>${OTP}</b></p>`, // html body
            });
        
            console.log("Message sent: %s", info.messageId);

            res.cookie('otp',cryptr.encrypt(JSON.stringify(OTP)),{maxAge:30*1000});
            res.cookie('email',cryptr.encrypt(JSON.stringify(isExistUser.email)));

            return res.redirect('/checkOtp');

        }else{
            console.log("User not Found");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('back')
    }
};

module.exports.checkOtp = async(req,res)=>{
    try {
        let isOtp = false;
        if(req.cookies.otp){
            isOtp = true;
        }
        const email = JSON.parse(cryptr.decrypt(req.cookies.email));
        return res.render('users/checkOtp',{email,isOtp});
    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('back');
    }
};

module.exports.verifyOtp = async(req,res)=>{
    try {
        const otp = JSON.parse(cryptr.decrypt(req.cookies.otp));

        if(otp == req.body.otp){
            res.clearCookie('otp');
            return res.redirect('/forgetPassword');
        }else{
            console.log("Invalid Otp");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('back');
    }
};

module.exports.forgetPassword  = async(req,res)=>{
    try {
        return res.render('users/forgetPassword',{
            errors : null,
            oldValue :null
        })
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.checkPassword = async(req,res)=>{
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('users/forgetPassword',{
                errors : errors.mapped(),
                oldValue :req.body
            });  
        }

        const email = JSON.parse(cryptr.decrypt(req.cookies.email));
        const userData = await User.findOne({email:email});
        if(userData){
            if(req.body.newPassword == req.body.confirmPassword){
                const newPass = await bcrypt.hash(req.body.newPassword,10);
                const forgetUserPass = await User.findByIdAndUpdate(userData._id,{password:newPass});
                res.clearCookie('email');
                console.log("Password forgeted");
                return res.redirect('/');
            }else{
                console.log("New And Confirm password are not Match");
                return res.redirect('/forgetPassword');
            }
        }else{
            console.log("User not found");
            return res.redirect('/forgetPassword')
        }
    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('/forgetPassword');
    }
}