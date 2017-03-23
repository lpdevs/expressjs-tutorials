var express = require('express');
var router = express.Router();

// configure database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');
var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
});
var Person = mongoose.model('Person', personSchema);

/*
 * router.METHOD(route, callback)
 * TODO: tell what to do when a get request at the given route is called.
 * METHOD: any one of the HTTP verbs(get, set, put, delete)
 * @PARAM:
 * route: a given route
 * callback has two parameters: req, res
 * --> req: represents the HTTP request
 * --> res: represents the HTTP response
 */
router.get('/', function(req, res){
  //res.send('Main page');
  res.render('index');
});

// TEST: navigate to http://<HOST>/hello
router.get('/hello', function(req, res){
  res.send('Hello');
});

// TEST: curl -X POST "http://<HOST>/hello"
router.post('/hello', function(req, res){
  res.send('You just called the post method at /hello');
});

// just for test
router.all('/test', function(req, res){
  res.send('HTTP method doesn\'t have any effect on this route');
});

router.get('/:id([0-9]{5})', function(req, res){
  //res.send('The id you specified is: ' + req.params.id);
  params = {
    id_params : req.params.id,
  };
  res.render('id', params);
});

// test get form
router.get('/form', function(req, res){
  res.render('form');
});

// test cookie
// open console in browser: console.log(document.cookie)
router.get('/cookie', function(req, res){
  //res.cookie('name', 'express', {expire: 360000 + Date.now()}).send('cookie set'); // set name=express
  res.cookie('name', 'express', {maxAge: 360000}).send('cookie set'); // set name=express
});

// test cookie from server
router.get('/getcookie', function(req, res){
  res.send('Cookies: ' + JSON.stringify(req.cookies));
});

// test delete cookie
router.get('/delcookie', function(req, res){
  res.clearCookie('name').send('cookie cleared');
})

// test post form
router.post('/form', function(req, res){
  res.send('Received your request: ' + ' body:' + JSON.stringify(req.body));
});

var Users = {};

// sign up
router.get('/signup', function(req, res){
  res.render('signup');
})

router.post('/signup', function(req, res){
  if(!req.body.id || !req.body.password){
    res.status('400');
    res.send('Invalid details');
  }else{
    if(Users[req.body.id] !== undefined)
      res.render('signup', {message: 'User already exists'});

    var newUser = {id: req.body.id, password: req.body.password, valid: 1};
    Users[req.body.id] = newUser;
    res.redirect('/protected_page/' + req.body.id);
  }
});

router.get('/protected_page/:id', function(req, res){
  if(Users[req.params.id] === undefined || Users[req.params.id].valid === 0){
    res.send('The user doesn\'t exist or never log in');
  }
  else{
    var params = {
      id : req.params.id,
    };
    res.render('protected_page', params);
  }
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', function(req, res){
  if(!req.body.id || !req.body.password)
    res.render('login', {message: "Please enter both id and password"});
  else{
    if(Users[req.body.id].id === undefined)
      res.render('login', {message: 'Please sign up'});
    else if (Users[req.body.id].password !== req.body.password)
      res.render('login', {message: 'wrong password'});
    else {
      Users[req.body.id].valid = 1;
      res.redirect('/protected_page/' + req.body.id);
    }
  }
});

router.get('/logout/:id', function(req, res){
  Users[req.params.id].valid = 0;
  res.redirect('/login');
});

// test with database
router.get('/person', function(req, res){
  res.render('person');
});

router.post('/person', function(req, res){
  var personInfo = req.body;
  if( !personInfo.name || !personInfo.age || !personInfo.nationality){
    res.send('Sorry, you provided wrong info');
  }else{
    var newPerson = new Person({
      name: personInfo.name,
      age: personInfo.age,
      nationality: personInfo.nationality
    });

    newPerson.save(function(err, res2){
      console.log(res2);
      if(err) res.send('Database error');
      else res.send('New person added');
    });
  }
});

router.get('/people', function(req, res){
  Person.find(function(err, res2){
    res.json(res2);
  });
});

router.put('/people/:id', function(req, res){
  Person.findByIdAndUpdate(req.params.id, req.body, function(err, res2){
    if(err) res.json({message: 'Error in updating person with id: ' + req.params.id});
    else res.json(res2);
  });
});

module.exports = router;
