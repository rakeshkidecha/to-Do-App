const ToDo = require('../models/ToDoModel');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('SecretKeydfhkdi8df');

module.exports.viewToDo = async(req,res)=>{
    try {
        const user = JSON.parse(cryptr.decrypt(req.cookies.user))
        
        if(!user){
            return res.redirect('/');
        }

        const allToDo = await ToDo.find({userId:user._id});
        return res.render('to-do/home',{allToDo,user});
    } catch (err) {
        console.log("Something Wrong ",err);
        return res.redirect('back');
    }
}

module.exports.insertToDo = async (req,res)=>{
    try {

        const user = JSON.parse(cryptr.decrypt(req.cookies.user));

        req.body.userId = user._id;

        const addedToDo = await ToDo.create(req.body);

        if(addedToDo){
            console.log("To Do Added successfully...");
            return res.redirect('back');
        }else{
            console.log("To Do added faild..");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong ",err);
        return res.redirect('back');
    }
}

// delete to do 
module.exports.deleteToDo = async (req,res)=>{
    try {
        const deleteToDo = await ToDo.findByIdAndDelete(req.params.id);
        if(deleteToDo){
            console.log("To Do Deleted successfully...");
            return res.redirect('back');
        }else{
            console.log("To Do deleted faild..");
            return res.redirect('back')
        }
    } catch (err) {
        console.log("Something Wrong ",err);
        return res.redirect('back');
    }
}

// update to do 
module.exports.updateToDo = async (req,res)=>{
    try {
        const updatedToDo = await ToDo.findByIdAndUpdate(req.body.id,req.body);
        if(updatedToDo){
            console.log("To Do Updeted successfully...")
            return res.redirect('back');
        }else{
            console.log("To Do updated faild..");
            return res.redirect('back')
        }
    } catch (err) {
        console.log("Something Wrong ",err)
        return res.redirect('back')
    }
}

// go to process ---------------------
module.exports.checkToProceed = async (req,res)=>{
    try {
        const completeToDo = await ToDo.findByIdAndUpdate(req.params.id,{toDoType:'inProcess'});
        if(completeToDo){
            console.log("To do completed...");
            return res.redirect('back');
        }else{
            console.log("faild to check completed..");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back')
    }
}
// -----------------------

// to do completed ---------------------------------------

module.exports.checkToCompleted = async (req,res)=>{
    try {
        const completeToDo = await ToDo.findByIdAndUpdate(req.params.id,{toDoType:'completed'});
        if(completeToDo){
            console.log("To do completed...");
            return res.redirect('back');
        }else{
            console.log("faild to check completed..");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Something Wrong",err);
        return res.redirect('back')
    }
}

// ------------------------------
