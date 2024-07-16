const dotenv=require('dotenv');
dotenv.config();
// const PORT= require('./config/serverConfig.js')
module.exports={
    PORT:process.env.PORT,
}