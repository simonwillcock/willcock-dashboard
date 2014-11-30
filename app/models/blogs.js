var mongoose = require('mongoose');
var utils = require('../utility');

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
  title: String,
  body: String,
  date_modified: { type: Date, default: Date.now },
  date_created: { type: Date, default: Date.now },
  publication: [{
    status: { type: String, required: true, enum: ['published', 'draft', 'scheduled'], default: 'draft' },
    date: { type: Date }
  }]
});

BlogSchema.pre('save', function( next, done ){
  blog = utils.updateTimestamps(this);
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);