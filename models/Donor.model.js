const mongoose = require('mongoose');
const  User = require('./User.model')

const DonorSchema = mongoose.Schema({
    donor:{type: String,required:true,unique:true},
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    contacts: {type: String},
    address:{type:String},
    createdAt:Date,
    updatedAt:Date
});

DonorSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.createdAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.updatedAt)
    this.updatedAt = currentDate;
    next();
    });
    


module.exports = mongoose.model('Donor',DonorSchema);
