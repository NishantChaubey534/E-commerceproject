// $env:DEBUG="development:*"
// Remove-Item Env:DEBUG
// BnLax3nMm0OoFMCw
require('dotenv').config();
const mongoose = require('mongoose');
const config=require('config');
const dbgr=require("debug")("development:mongoose");

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
}).then(()=>{
    dbgr("connected");
})
.catch((err)=>{
    dbgr(err);

});
module.exports=mongoose.connection;