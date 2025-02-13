const mongoose = require('mongoose');
const env = require('dotenv').config();
// for offline DataBase 
mongoose.connect('mongodb://127.0.0.1:27017/to-do-app');

// for online DataBase 
// mongoose.connect(process.env.MONGODB_CONNECT_URI);

const db = mongoose.connection;

db.once('open',err=>console.log(err?err:"Mongodb connected"));

module.exports = db;