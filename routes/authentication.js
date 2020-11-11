const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { generateRandomString, userDb, registerUser } = require('../helper');

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//=============
//   Register
//=============

app.get('/register', (req, res) => {
  res.render('registration');
});

app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  registerUser(id, email, password);

  res.cookie('user_id', id);
  res.redirect('/urls');

  console.log(userDb[id]);
});

//=============
//   LOGIN
//=============

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
