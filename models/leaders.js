var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LeadersSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    image: {type:String, required: true, max: 100},
    designation: {type: String, required: true, max: 45},
    abbr: {type: String, required: false},
    featured: {type: String, required: true},
    description: {type: String, required: false, max: 250}
  }
);

module.exports = mongoose.model('leaders',LeadersSchema);
