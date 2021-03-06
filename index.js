const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const users = require('./users')
const expressValidator = require('express-validator');

console.log(users);

const app = express();


// tell express to use handlebars
app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());

// configure session support middleware with express-session
app.use(
  session({
    secret: 'mouse', // this is a password. make it unique
    resave: false, // don't resave the session into memory if it hasn't changed
    saveUninitialized: true // always create a session, even if we're not storing anything in it.
  })
);

// tell express how to serve static files
app.use(express.static('public'));

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// add express-validator middleware
app.use(expressValidator());

app.use((req, res, next) => {
  if (!req.session.users)
    req.session.users = []
  console.log(req.session);
  next();
});

app.get('/', function(req, res) {
  //if there isn't currently a user logged in...
  if (req.session.users.length === 0) {
    //redirect to login page
    res.redirect('login')
    //else send them to the home page
  } else {
    res.render('home', {
      info: req.session.users
    })
  }
})

app.get('/login', function(req, res) {
  //if there is not a user logged in...
  if (req.session.users.length === 0) {
    //stay on the login page
    res.render('login')
    //else take them to the home page
  } else {
    res.redirect('/')
  }
})


app.post('/login/smerg', (req, res) => {
//providing error messages if the user does not provide a name or password
  req.checkBody('userName', 'Must provide a User Name').notEmpty();
  req.checkBody('password', 'Must provide a password').notEmpty();

  req.getValidationResult().then(function(result){
    var errorsArray = result.array()
    //if there is an error ie. greater than 0...
    if (errorsArray.length > 0) {
      //take them back to the login page and display errors
      res.render('login', {
        errors: errorsArray
      })
  //if there are no errors we need to check if this is a valid user
    } else {
  //to do that we will iterate over the users.js file to make sure that username and password match key values that they have been assigned
    for (var i = 0; i < users.length; i++) {
      //if it matches, redirect them to home and push the session info into the array
      if (req.body.userName === users[i].userName && req.body.password === users[i].password) {
        (req.session.users).push(users[i])
        res.redirect('/')
      }
    }
  }
  //if none of the above is true, take them straight to the login page
  res.redirect('/login')
})
})


// make express listen on port 3000
app.listen(3000);
