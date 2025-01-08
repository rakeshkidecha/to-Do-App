const express = require('express');
const ToDoCtl = require('../controller/toDoCtl');
const router = express.Router();

// home page ---
router.get('/',ToDoCtl.viewToDo);

// create a to do 
router.post('/insertToDo',ToDoCtl.insertToDo);

// delete to do 
router.get('/deleteToDo/:id',ToDoCtl.deleteToDo);

// update to do 
router.post('/updateToDo',ToDoCtl.updateToDo);

// go to process -------
router.get('/checkToProceed/:id',ToDoCtl.checkToProceed);

// to do completed -------
router.get('/checkToCompleted/:id',ToDoCtl.checkToCompleted);


module.exports = router;