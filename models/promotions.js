var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PromotionsSchema = new Schema(
  {
    name: {type: String, required: false, max: 100},
    image: {type:String, required: false, max: 100},
    label: {type: String, required: false, max: 45},
    price: {type: Number, required: false},
    featured: {type: String, required: false},
    description: {type: String, required: false, max: 250}
  }
);

module.exports = mongoose.model('promotions',PromotionsSchema);
