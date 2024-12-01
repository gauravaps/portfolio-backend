const express=require('express');
const { sendQuery,  login } = require('../controller/queryController');
const { authCheck } = require('../middileware/authCheck ');


const router =express.Router();

router.post('/',sendQuery);

//find admin user
router.post('/admin' ,login)




module.exports=router;

