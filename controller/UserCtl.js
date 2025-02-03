const User = require("../models/UserModel");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('SecretKeydfhkdi8df');

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
            if(existUser.password===req.body.password){
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
            return res.render('users/signUp');
        }
    } catch (err) {
        console.log("SOmething Wrong",err)
        return res.redirect('back')
    }
}

module.exports.insertUser = async(req,res)=>{
    try {

        const isExistEmail = await User.find({email:req.body.email}).countDocuments();
        
        if(isExistEmail != 0){
            console.log("Email is already Exist, please try another email....");
            return res.redirect('back');
        }
        
        if(req.body.password != req.body.confirmPassword){
            console.log("Password and confirm password not match..");
            return res.redirect('back');
        }

        var imagePath = '';
        if(req.file){
            imagePath = User.imgPath+'/'+req.file.filename
        }

        req.body.profile_image = imagePath;
        req.body.name = req.body.fName+' '+req.body.lName;

        const addedUser = await User.create(req.body);

        if(addedUser){
            const encryptUserData = cryptr.encrypt(JSON.stringify(addedUser))
            res.cookie('user',encryptUserData)
            console.log("Account Create SuccessFully");
            return res.redirect('/home');
        }else{
            console.log("Account Create Failed");
            return res.redirect('back')
        }


    } catch (err) {
        console.log("Something Wrong",err)
        return res.redirect('back')
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
}