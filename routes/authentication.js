const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const { generateRandomString, registerUser, isUser, userDb } = require('../helper');


//=============
//   Register
//=============

app.get('/register', (req, res) => {
  res.render('register', { user: userDb[req.session.userID] });
});

app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    return res.status(400).send('Incorret Email or Password Entered');
  }

  if (isUser(email)) {
    return res.status(400).send('Email already registered');
  }

  registerUser(id, email, hashedPassword);

  req.session.userID = id;
  console.log(req.session.userID);
  res.redirect('/urls');
});

//=============
//   LOGIN
//=============

app.get('/login', (req, res) => {
  res.render('login', { user: userDb[req.session.userID] });
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = isUser(email);

  const hashedPassword = bcrypt.compareSync(password, user.password);

  if (!user) {
    return res.status(403).send('Invalid email/password');
  }

  if (!hashedPassword) {
    return res.status(403).send('Invalid email/password');
  }

  req.session.userID = user.id;
  console.log(req.session.userID);
  res.redirect('/urls');
});

//=============
//   LOGOUT
//=============

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


module.exports = app;