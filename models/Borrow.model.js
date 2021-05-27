const mongoose = require('mongoose');
const Staff = require('./Staff.model')
const  User = require('./User.model')
const  Asset = require('./Psm.model')

const BorrowSchema = mongoose.Schema({
    asset:{
        type: mongoose.Types.ObjectId,
        ref: "Asset",
      },
      borrowed_by:{
        type: mongoose.Types.ObjectId,
        ref: "Staff",
      },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    createdAt:Date,
    updatedAt:Date
});

BorrowSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.createdAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.updatedAt)
    this.updatedAt = currentDate;

    next();
    });
    


module.exports = mongoose.model('Borrow',BorrowSchema);