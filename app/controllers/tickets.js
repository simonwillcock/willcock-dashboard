var Blog  = require('../models/tickets');
var utils = require('../utility');

// routes that end in /tickets

// create a ticket (accessed by POST /api/tickets)
exports.postTicket = function (req, res){

  var ticket = new Ticket(); // create new instance of Ticket model
  ticket = utils.updateModel(ticket, Ticket, req.body);

  // save ticket and check for errors
  ticket.save(function(err) {
    if (err)
      res.send(err);

    res.json({message: 'Ticket created!'});
  });
};
// get all the tickets (accessed at GET /api/tickets)
exports.getTickets = function(req, res){
  Ticket.find(function(err, tickets){
    if (err)
      res.send(err);

    res.json(tickets);
  });
};

// routes that end in /tickets/:ticket_id


// get the ticket with that id (accessed at GET /api/tickets/:ticket_id)
exports.getTicket = function (req, res){
  Ticket.findById(req.params.ticket_id, function (err, ticket) {
    if (err)
      res.send(err);

    res.json(ticket);
  });
};

// update the ticket with this id (accessed at PUT /api/tickets/:ticket_id)
exports.putTicket = function (req, res) {
  // user our ticket model to find the ticket we want
  Ticket.findById(req.params.ticket_id, function (err, ticket) {
    if (err)
      res.send(err)

    ticket = utils.updateModel(ticket, Ticket, req.body);

    // save the ticket
    ticket.save(function (err) {
      if (err)
        res.send(err);

      res.json({ message: 'Ticket updated!' });
    });
  });
};

// delete the ticket with this id (accessed at DELETE /api/tickets/:ticket_id)
exports.deleteTicket = function (req, res) {
  Ticket.remove({
    _id: req.params.ticket_id
  }, function (err, ticket) {
    if (err)
      res.send(err);

    res.json({ message: 'Ticket ' + req.params.ticket_id + ' deleted' });
  });
};
