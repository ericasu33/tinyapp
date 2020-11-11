const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { generateRandomString, users } = require('../helper');

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


//=============
//   Register
//=============
app.get('/register', (req, res) => {
  const templateVar = {
    user: users[req.cookies.user_id],
  };

  res.render('registration', templateVar);
});

app.post('/register', (req, res) => {
  const id = generateRandomString();
  users[id] = {
    id,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', id);
  res.redirect('/urls');

  console.log(users);

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
