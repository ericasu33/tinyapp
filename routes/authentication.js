const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { generateRandomString, registerUser, isUser } = require('../helper');

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//=============
//   Register
//=============

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Incorret Email or Password Entered');
  }

  if (isUser(email)) {
    return res.status(400).send('Email already registered');
  }

  registerUser(id, email, password);

  res.cookie('user_id', id);
  res.redirect('/urls');
});

//=============
//   LOGIN
//=============

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = isUser(email);

  if (!user) {
    return res.status(403).send('Invalid email/password');
  }

  if (user.password !== password) {
    return res.status(403).send('Invalid email/password');
  }

  res.cookie('user_id', user.id);
  res.redirect('/urls');
  

});

//=============
//   LOGOUT
//=============

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


module.exports = app;