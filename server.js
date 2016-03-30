// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Todo = require('./models/todo');

// Connect to the todolocker MongoDB
mongoose.connect('mongodb://localhost:27017/todolocker');

// Create our Express application
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);
app.use( bodyParser.json() );
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'todo start!' }); 
});

// Create a new route with the prefix /todos
var todosRoute = router.route('/todos');

// Create endpoint /api/todos for POSTS
todosRoute.post(function(req, res) {
  // Create a new instance of the todo model
  var todo = new Todo();

  // Set the todo properties that came from the POST data
  todo.todoText = req.body.todoText;
  todo.done = req.body.done;

  // Save the todo and check for errors
  todo.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'todo added to the list!', data: todo });
  });
});

// Create endpoint /api/todos for GET
todosRoute.get(function(req, res) {
  // Use the todo model to find all todo
  Todo.find(function(err, todos) {
    if (err)
      res.send(err);

    res.json(todos);
  });
});

// Create a new route with the /todos/:todo_id prefix
var todoRoute = router.route('/todos/:todo_id');

// Create endpoint /api/todos/:todo_id for GET
todoRoute.get(function(req, res) {
  // Use the todo model to find a specific todo
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    res.json(Todo);
  });
});

// Create endpoint /api/todos/:todo_id for PUT
todoRoute.put(function(req, res) {
  // Use the todo model to find a specific todo
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    // Update the existing todo
    todo.done = req.body.done;
    todo.todoText = req.body.todoText;

    // Save the todo and check for errors
    todo.save(function(err) {
      if (err)
        res.send(err);

      res.json(todo);
    });
  });
});

// Create endpoint /api/todos/:todo_id for DELETE
todoRoute.delete(function(req, res) {
  // Use the todo model to find a specific todo and remove it
  Todo.findByIdAndRemove(req.params.todo_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'todo removed from the list!' });
  });
});

/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert todo on port ' + port);