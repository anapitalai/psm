const { text } = require('express');
const mongoose = require('mongoose');
const  User = require('./User.model')

//const bodyParser = require('body-parser');



const PSMSchema = mongoose.Schema({
  location_name: { type: String,required: true,unique: true },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  //eastings: { type: Number,required: true },
  //northings: { type: Number,required: true },
  eastings_error: { type: Number,required: false },
  northings_error: { type: Number,required: false },
  ellipsoidal_height: { type: Number,required: false },
  ellipsoidal_height_error: { type: Number,required: false },
  n_value:{type:Number,required: false},
  mean_sea_level:{type:Number,required: false},
  lat:{type: Number},
  lon:{type: Number},
  psm_type:{type:String},
  createdAt: Date,
  updatedAt: Date ,

});

PSMSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.createdAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.updatedAt)
    this.updatedAt = currentDate;
    next();
    });
    
    // PSMSchema.pre('save',function(next){
    //   const result = utm2ll.UTM2LL(499642.937,9263205.309,55,false)
    //   //const result = utm2ll.UTM2LL(req.body.eastings,req.body.northings,false)
    //   console.log(result)
    //   this.lat=result[0]
    //   this.lon = result[1]
    //   console.log(this.lat,this.lon)
    //   //update latlon
  
    //   next();  
     
    // });



module.exports = mongoose.model('PSM',PSMSchema);
