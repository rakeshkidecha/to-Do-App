const mongoose = require('mongoose');
const moment = require('moment');

const ToDoSchema = mongoose.Schema({
    title :{
        type :String,
        required : true
    },
    tag :{
        type :String,
        required : true
    },
    description :{
        type :String,
        required : true
    },
    createDate :{
        type :String,
        default : moment().format('YYYY-MM-DD')
    },
    toDoType:{
        type : String,
        default : "pending"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }
})

const ToDo = mongoose.model('ToDo',ToDoSchema);
module.exports = ToDo;