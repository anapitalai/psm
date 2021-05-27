const mongoose = require('mongoose');
const  User = require('./User.model')

const CATSketchSchema = mongoose.Schema({
   cat_sketch_name: {type:String,required:true,unique:true},
   cat_sketch_image:{type:String,required:true},
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
      },
    createdAt:Date,
    updatedAt:Date
    
});
CATSketchSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.createdAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.updatedAt)
    this.updatedAt = currentDate;
    next();
    });
    


module.exports = mongoose.model('CATSketch',CATSketchSchema);
