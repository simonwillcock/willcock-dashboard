var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TicketSchema = new Schema({
	title: String
});

module.exports = mongoose.model('Ticket', TicketSchema);