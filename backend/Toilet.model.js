const mongoose = require('mongoose');

var ContactSchema = mongoose.Schema({   
  ToiletId: {type: Number, require:true},
  Temperature: { type: Number, require: true}, 
  Humidity:{type: Number, require: true},
  State:{type: Boolean, require: true}, 
  Weight:{type: Number, require: true},
});

module.exports = mongoose.model('Toilet_Info', ContactSchema); 