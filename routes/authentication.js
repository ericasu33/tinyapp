const express = require('express');
const app = express();

const { generateRandomString, registerUser, isUser, userDb } = require('../helper');


//=============
//   Register
//=============

app.get('/register', (req, res) => {
  res.render('register', { user: userDb[req.cookies.userID] });
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

  res.cookie('userID', id);
  res.redirect('/urls');
});

//=============
//   LOGIN
//=============

app.get('/login', (req, res) => {
  res.render('login', { user: userDb[req.cookies.userID] });
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

  res.cookie('userID', user.id);
  res.redirect('/urls');
});

//=============
//   LOGOUT
//=============

app.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});


module.exports = app;