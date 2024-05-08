const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 8000;
const product = require('./products')

// const example = require('./example')
app.use(express.json());
app.use(cors({origin:true,credentials:true}));

app.get('/',(req,res) => {
   res.status(200).json({message:"Server running"})
})

app.use('/',product);

app.listen(PORT, ()=> {
   console.log(`http://loaclhost:${PORT}/`);
})