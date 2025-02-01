const express = require('express');
const port = 8001;
const path = require('path');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const env = require('dotenv').config();
const app =  express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'assets')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use('/',require('./routes/userRoutes'));

app.use('/home',require('./routes/toDoRoutes'));


app.listen(port,err=>console.log(err?err:"Server Runing in http://localhost:"+port));