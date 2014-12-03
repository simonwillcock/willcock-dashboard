// Server.js

// BASE SETUP
// ============

// call the packages we need
var express    = require('express')
var app        = express();
var bodyParser = require('body-parser');
var config     = require('./api/config/config');
var utils      = require('./api/utility');
var jwt = require('jsonwebtoken');

// Connect to DB
var mongoose   = require('mongoose');
mongoose.connect('mongodb://'+config.db.user_name+':'+config.db.user_password+'@'+config.db.host+':'+config.db.port+'/'+config.db.db_name);

// User bodyparser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('*', function (req, res, next) {
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Auth');
	if ('OPTIONS' == req.method) return res.send(200);
	next();
});


var port   = process.env.PORT || 8081;

// Add models
var Ticket = require('./api/models/tickets');
var Blog = require('./api/models/blogs');


// ROUTES FOR OUR API
//         ============
var apiUnprotected = express.Router(),
    apiProtected = express.Router();


// middleware to use for all requests
apiUnprotected.use(function(req, res, next){
	// do logging
	console.log('Something is happening');
	next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working
apiUnprotected.get('/', function(req, res) {
	res.json({ message: 'hooray! Welcome to our API' });
});

// more routes here
var blogController = require('./api/controllers/blogs');
var ticketController = require('./api/controllers/tickets');
var userController = require('./api/controllers/users');
var sessionController = require('./api/controllers/sessions');

// routes that end in /tickets
apiProtected.route('/tickets')

	// create a ticket (accessed by POST /api/tickets)
	.post(ticketController.postTicket)

	// get all the tickets (accessed at GET /api/tickets)
	.get(ticketController.getTickets);

// routes that end in /tickets/:ticket_id
apiProtected.route('/tickets/:ticket_id')

	// get the ticket with that id (accessed at GET /api/tickets/:ticket_id)
	.get(ticketController.getTicket)

	// update the ticket with this id (accessed at PUT /api/tickets/:ticket_id)
	.put(ticketController.putTicket)

	// delete the ticket with this id (accessed at DELETE /api/tickets/:ticket_id)
	.delete(ticketController.deleteTicket);



// routes that end in /blogs
apiUnprotected.route('/blogs')
	// get all the blogs (accessed at GET /api/blogs)
	.get(blogController.getBlogs);

apiProtected.route('/blogs')
  // create a blog (accessed by POST /api/blogs)
  .post(blogController.postBlog)

// routes that end in /blogs/:blog_id
apiUnprotected.route('/blogs/:blog_id')
	// get the blog with that id (accessed at GET /api/blogs/:blog_id)
	.get(blogController.getBlog)

	
apiProtected.route('/blogs/:blog_id')
  // update the blog with this id (accessed at PUT /api/blogs/:blog_id)
  .put(blogController.putBlog)

  // delete the blog with this id (accessed at DELETE /api/blogs/:blog_id)
  .delete(blogController.deleteBlog);


// routes that end in /users
apiUnprotected.route('/users')
	// create a user (accessed by POST /api/users)
	.post(userController.register)

 
apiProtected.route('/users')
  // get all the users (accessed at GET /api/users)
  .get(userController.getUsers);

apiProtected.route('/users/:user_id')
	.get(userController.getUser)
	.delete(userController.deleteUser);

apiUnprotected.route('/login')
	.post(userController.login);
apiUnprotected.route('/register')
	.post(userController.register);
apiUnprotected.route('/logout')
	.get(userController.logout);

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /API
app.use('/api', apiUnprotected);
app.use('/api', sessionController.verifyToken, apiProtected);

// START THE SERVER
// =============
app.listen(port);
console.log('Listening on port ' + port);