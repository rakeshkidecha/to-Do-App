const mongoose = require('mongoose');

const imagePath = '/uploads/users';
const multer = require('multer');
const path = require('path');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique : true
    },
    password:{
        type:String,
        required:true,
        unique : true
    },
    profile_image:{
        type:String,
        required:true
    },
})

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now())
    }
})

UserSchema.statics.uploadProfileImage = multer({storage:imageStorage}).single('profile_image');
UserSchema.statics.imgPath = imagePath

const User = mongoose.model('User',UserSchema);
module.exports = User;