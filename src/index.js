const express= require('express');
const app = express();
const morgan= require('morgan');
const{createProxyMiddleware}=require('http-proxy-middleware');
const{PORT}=require('./config/serverConfig')
const rateLimit=require('express-rate-limit'); 
const axios= require('axios');
app.use(morgan('combined'));

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	
})
app.use(limiter);







// app.use('/bookingService',createProxyMiddleware({target:'http://localhost:3002/',changeOrigin:true}));


app.use('/bookingservice',async(req,res,next)=>{
  console.log(req.headers['x-access-token']);

  try {
    const response= await axios.get('http://localhost:3001/api/v1/isauthenticated',{
      headers:{
        'x-access-token': req.headers['x-access-token']
      }
    });
    console.log(response.data);
    if(response.data.success)
    {
        next();
    }
    else{
      res.status(401).json({
        message: 'Authentication failed'
      })
    }
  } catch (error) {
      return res.status(401).json({
        message: 'Unauthorised'
      })
  }


  
  //console.log("Hi");
  // next();
  // if(response.data.success)
  // {
  //   next();
  // }
  // else{
  //   return res.status(401).json({
  //     message:'Authentication failed'
  //   })
  // }
  
})


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



// app.listen(PORT,(req,res)=>{
//     console.log(`Server is running on port ${PORT}`);
// })
app.listen(3005,(req,res)=>{
  console.log(`Server is running on port 3005`);
})
