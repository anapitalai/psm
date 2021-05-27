const mongoose = require('mongoose');
const  User = require('./User.model')
const Room = require('./CATSketch.model')

const StaffSchema = mongoose.Schema({
    full_name:{type:String,required:true,unique:true},
    position:{type:String},
    occupant: {
        type: mongoose.Types.ObjectId,
        ref: "Room",
      },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    email: {type: String},
    ip_address:{type:String},
    contacts:{type:String},
    createdAt:Date,
    updatedAt:Date
});

StaffSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.createdAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.updatedAt)
    this.updatedAt = currentDate;
    next();
    });
    


module.exports = mongoose.model('Staff',StaffSchema);
