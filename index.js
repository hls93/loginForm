const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require ('express-session');
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
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use(bodyParser.urlencoded({ extended: false }));

// add express-validator middleware
app.use(expressValidator());

app.use((req, res, next) => {
  // if we don't already have an array of foods
  if (!req.session.users) {
    // then create an empty array of foods
    req.session.users = [];
  }

  console.log(req.session);

  next();
});

app.get('/', function(req, res){
  res.render('home')
})

app.get('/login', function(req, res){
  res.render('login')
})


app.post('/login/', (req, res) => {
  for (let i in users)
    req.body.userName === users[i].userName &&
    req.body.password === users[i].password ? res.render('home') : res.redirect('/')

    req.session.users.push(type);

    //errors

})





// make express listen on port 3000
app.listen(3000);
