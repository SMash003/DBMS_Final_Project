import express from 'express';
import {config} from 'dotenv';
config();


const app= express();
const port = process.env.APP_PORT || 5000;
console.log(process.env.APP_PORT)

app.use(express.json());


//initial route
app.get('/', (req,res)=>{
    res.send("Criminal Alert")
})

const server = app.listen(port, ()=>{
    console.log(`server is running in port : ${port}`);
}) 