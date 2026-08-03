import express from 'express';
import {config} from 'dotenv';
import { connectDB } from './config/db.js';
config();
connectDB();


//importing different routes
import authRoutes from './routes/authRoutes.js'
import stationRoutes from './routes/stationRoutes.js'
import officersRoutes from './routes/officerRoutes.js'
import crimeRoutes from './routes/crimeRoutes.js'
import criminalsRoutes from './routes/criminalsRoutes.js'
import caseRoutes from './routes/caseRoutes.js'
import criminalCaseRoutes from './routes/criminalCaseRoutes.js'
import victimRoutes from './routes/victimRoutes.js'
import witnessRoutes from './routes/witnessRoutes.js'
import evidenceRoutes from './routes/evidenceRoutes.js'
import arrestRoutes from './routes/arrestRoutes.js'
import courtCaseRoutes from './routes/courtCaseRoutes.js'
import sentenceRoutes from './routes/sentenceRoutes.js'


//middleware and other things
const app= express();
const port = process.env.APP_PORT || 5000;
console.log(process.env.APP_PORT)

app.use(express.json());

//Imported routes api
app.use("/api/users", authRoutes);
app.use("/api/stations", stationRoutes);
app.use('/api/officers',officersRoutes);
app.use('/api/crimes',crimeRoutes);
app.use('/api/criminals', criminalsRoutes);
app.use('/api/cases',caseRoutes);
app.use('/api/criminalCases',criminalCaseRoutes);
app.use('/api/victims',victimRoutes);
app.use('/api/witnesses', witnessRoutes);
app.use('/api/evidences', evidenceRoutes);
app.use('/api/arrestes',arrestRoutes);
app.use('/api/courtCases', courtCaseRoutes);
app.use('/api/sentences', sentenceRoutes);

//initial route
app.get('/', (req,res)=>{
    res.send("Criminal Alert")
})

const server = app.listen(port, ()=>{
    console.log(`server is running in port : ${port}`);
}) 