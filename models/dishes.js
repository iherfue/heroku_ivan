var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DisheSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    image: {type:String, required: true, max: 100},
    category: {type: String, required: true, max: 50},
    label: {type: String, required: false, max: 45},
    price: {type: Number, required: false},
    featured: {type: String, required: false},
    description: {type: String, required: false, max: 250},
    comments: [
            {
              ratings: Number, 
               comment: String,
               author: String,
               date: {type: Date, default: Date.now}
             }]
  }
);

module.exports = mongoose.model('dishe',DisheSchema);
