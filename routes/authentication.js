const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//===========
//   LOGIN
//===========

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

//===========
//   LOGOUT
//===========

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});
