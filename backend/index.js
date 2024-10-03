import express from 'express';
import serverConfig from './src/config/serverConfig.js';
import connectDataBase from './src/config/dbConfig.js';
import userRouter from './src/routes/userRoute.js';
import ownerRouter from './src/routes/ownerRoute.js';


const app = express();
app.use(express.json());



app.use("/api/user",userRouter );
app.use("/api/owner", ownerRouter);
app.all("*", (req, res)=>{
    res.status(StatusCodes.NOT_FOUND).json({message:"End point does not found"})
  })


app.listen(serverConfig.port, ()=>{
    console.log(`server running on ${serverConfig.port}`);
    connectDataBase(); 
})
