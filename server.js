// Server.js

// BASE SETUP
// ============

// call the packages we need
var express    = require('express')
var app        = express();
var bodyParser = require('body-parser');
var config     = require('./app/config/config');
var utils      = require('./app/utility');

// Connect to DB
var mongoose   = require('mongoose');
mongoose.connect('mongodb://'+config.db.user_name+':'+config.db.user_password+'@'+config.db.host+':'+config.db.port+'/'+config.db.db_name);

// User bodyparser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('*', function (req, res, next) {
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	if ('OPTIONS' == req.method) return res.send(200);
	next();
});

var port   = process.env.PORT || 8081;

// Add models
var Ticket = require('./app/models/tickets');
var Blog = require('./app/models/blogs');

// ROUTES FOR OUR API
//         ============
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next){

	// do logging
	console.log('Something is happening');
	next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working
router.get('/', function(req, res) {
	res.json({ message: 'hooray! Welcome to our API' });
});

// more routes here
var blogController = require('./app/controllers/blogs');
var ticketController = require('./app/controllers/tickets');
var userController = require('./app/controllers/users');

// routes that end in /tickets
router.route('/tickets')

	// create a ticket (accessed by POST /api/tickets)
	.post(ticketController.postTicket)

	// get all the tickets (accessed at GET /api/tickets)
	.get(ticketController.getTickets);

// routes that end in /tickets/:ticket_id
router.route('/tickets/:ticket_id')

	// get the ticket with that id (accessed at GET /api/tickets/:ticket_id)
	.get(ticketController.getTicket)

	// update the ticket with this id (accessed at PUT /api/tickets/:ticket_id)
	.put(ticketController.putTicket)

	// delete the ticket with this id (accessed at DELETE /api/tickets/:ticket_id)
	.delete(ticketController.deleteTicket);



// routes that end in /blogs
router.route('/blogs')
	// create a blog (accessed by POST /api/blogs)
	.post(blogController.postBlog)

	// get all the blogs (accessed at GET /api/blogs)
	.get(blogController.getBlogs);


// routes that end in /blogs/:blog_id
router.route('/blogs/:blog_id')

	// get the blog with that id (accessed at GET /api/blogs/:blog_id)
	.get(blogController.getBlog)

	// update the blog with this id (accessed at PUT /api/blogs/:blog_id)
	.put(blogController.putBlog)

	// delete the blog with this id (accessed at DELETE /api/blogs/:blog_id)
	.delete(blogController.deleteBlog);

// routes that end in /users
router.route('/users')
	// create a user (accessed by POST /api/users)
	.post(userController.register)

	// get all the users (accessed at GET /api/users)
	.get(userController.getUsers);

router.route('/users/:user_id')
	.delete(userController.deleteUser);

router.route('/login')
	.post(userController.login);
router.route('/register')
	.post(userController.register);
router.route('/logout')
	.get(userController.logout);

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /API
app.use('/api', router);

// START THE SERVER
// =============
app.listen(port);
console.log('Listening on port ' + port);