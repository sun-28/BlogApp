const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/auth',require('./routes/Auth'))
app.use('/api',require('./routes/Blog'))
app.use('/uploads',express.static(__dirname+'/uploads'))

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB Connected");
}).catch((err)=>{console.log(err)})

const server = app.listen(process.env.PORT,()=>{
    console.log(`Connected to server on port ${process.env.PORT}`);
})
