const mongoose = require('mongoose');
const Donor = require('./Donor.model');
const Staff= require('./Staff.model')
const Supplier = require('./Supplier.model')
const  User = require('./User.model')
const  GE = require('./PSMSketch.model')

const RegistrySchema = mongoose.Schema({
  GENumber: {
    type: mongoose.Types.ObjectId,
    ref: 'GE',
  },
  drawnToStaff: {
    type: mongoose.Types.ObjectId,
    ref: 'Staff',
  },
  deptRef: {
    type: mongoose.Types.ObjectId,
    ref: "Donor",
  },

  drawnToCompany: {
    type: mongoose.Types.ObjectId,
    ref: "Supplier",
  },
  amount: { type: Number,required: true },
  quoteNumber: { type: String,required: false },
  RAPOCHQ: { type: String },
  taxInvoiceDD: { type: String },
  paymentStatus: { type: String, enum: ["payment made","GE cancelled","GE pending","Yet to collect RA"], required: true},
  drawDate: { type: Date, required: false},
  particulars: { type: String},
  createdAt: Date,
  updatedAt: Date ,
  

});

RegistrySchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.createdAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.updatedAt)
    this.updatedAt = currentDate;
    next();
    });
    


module.exports = mongoose.model('Registry',RegistrySchema);
