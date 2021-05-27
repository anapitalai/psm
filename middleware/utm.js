const bodyParser = require('body-parser');
const PSM = require('../models/Psm.model')
const express=require('express')
const app=express()
app.use(bodyParser.urlencoded({ extended: false }));
module.exports=(req, res, next) => {

    // do any checks you want to in here
    PSM.findOneAndUpdate({ lat: req.body.lat,lon:req.body.lon,function(){
        if (err) throw err;
        else{
            console.log(lat,lon);
        }
    } });

    next();

    };
