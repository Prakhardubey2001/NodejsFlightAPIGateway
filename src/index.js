const express= require('express');
const app = express();
const morgan= require('morgan');
const{createProxyMiddleware}=require('http-proxy-middleware');
const{PORT}=require('./config/serverConfig')
const rateLimit=require('express-rate-limit'); 
app.use(morgan('combined'));

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	
})
app.use(limiter);







// app.use('/bookingService',createProxyMiddleware({target:'http://localhost:3002/',changeOrigin:true}));

app.use('/bookingService', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/bookingService': '', // This will remove '/bookingService' prefix when forwarding
    },
  }));

app.get('/home',(req,res)=>{
    return res.json({message:'OK'});
})



app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})
