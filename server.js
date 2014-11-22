// Server.js

// BASE SETUP
// ============

// call the packages we need
var express    = require('express')
var app        = express();
var bodyParser = require('body-parser');
var config     = require('./config');

// Connect to DB
var mongoose   = require('mongoose');
mongoose.connect('mongodb://'+config.db.user_name+':'+config.db.user_password+'@'+config.db.host+':'+config.db.port+'/'+config.db.db_name);

// User bodyparser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port   = process.env.PORT || 8081;

// Add models
var Ticket = require('./app/models/tickets');

// ROUTES FOR OUR API
//         ============
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next){
	// do logging
	console.log('Something is happening');
	// console.log(req);
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
router.get('/', function(req, res) {
	res.json({ message: 'hooray! Welcome to our API' });
});

// more routes here
// routes that end in /tickets
router.route('/tickets')
	// create a ticket (accessed by POST /api/tickets)
	.post(function (req, res){

		var ticket = new Ticket(); // create new instance of Ticket model
		ticket.title = req.body.title; // set the ticket title from request

		// save ticket and check for errors
		ticket.save(function(err) {
			if (err)
				res.send(err);

			res.json({message: 'Ticket created!'});
		});
	})
	// get all the tickets (accessed at GET /api/tickets)
	.get(function(req, res){
		Ticket.find(function(err, tickets){
			if (err)
				res.send(err);

			res.json(tickets);
		});
	});

// routes that end in /tickets/:ticket_id
router.route('/tickets/:ticket_id')

	// get the ticket with that id (accessed at GET /api/tickets/:ticket_id)
	.get(function (req, res){
		Ticket.findById(req.params.ticket_id, function (err, ticket) {
			if (err)
				res.send(err);

			res.json(ticket);
		});
	})

	// update the ticket with this id (accessed at PUT /api/tickets/:ticket_id)
	.put(function (req, res) {
		// user our ticket model to find the ticket we want
		Ticket.findById(req.params.ticket_id, function (err, ticket) {
			if (err)
				res.send(err)

			ticket.title = req.body.title; // update the ticket info

			// save the ticket
			ticket.save(function (err) {
				if (err)
					res.send(err);

				res.json({ message: 'Ticket updated!' });
			});
		});
	})

	// delete the ticket with this id (accessed at DELETE /api/tickets/:ticket_id)
	.delete(function (req, res) {
		Ticket.remove({
			_id: req.params.ticket_id
		}, function (err, ticket) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /API
app.use('/api', router);

// START THE SERVER
// =============
app.listen(port);
console.log('Listening on port ' + port);