import express from 'express';
import {config} from 'dotenv';
import { connectDB } from './config/db.js';
config();
connectDB();


//importing different routes
import authRoutes from './routes/authRoutes.js'
import stationRoutes from './routes/stationRoutes.js'

const app= express();
const port = process.env.APP_PORT || 5000;
console.log(process.env.APP_PORT)

app.use(express.json());

//Imported routes api
app.use("/api/users", authRoutes);
app.use("/api/stations", stationRoutes);

//initial route
app.get('/', (req,res)=>{
    res.send("Criminal Alert")
})

const server = app.listen(port, ()=>{
    console.log(`server is running in port : ${port}`);
}) 