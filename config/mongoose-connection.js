// $env:DEBUG="development:*"
// Remove-Item Env:DEBUG

const mongoose = require('mongoose');
const config=require('config');
const dbgr=require("debug")("development:mongoose");

mongoose.connect(`${config.get("MONGODB_URI")}/project2`)
.then(()=>{
    dbgr("connected");
})
.catch((err)=>{
    dbgr(err);

});
module.exports=mongoose.connection;