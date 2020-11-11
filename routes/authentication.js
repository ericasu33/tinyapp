const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { generateRandomString, registerUser, emailExist } = require('../helper');

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

  if (emailExist(email)) {
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
  res.redirect('/urls');
});

//=============
//   LOGOUT
//=============

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});
