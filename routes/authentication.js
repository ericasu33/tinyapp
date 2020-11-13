const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { generateRandomString, registerUser, isUser, userDb } = require('../helper');


//=============
//   Register
//=============

router.get('/register', (req, res) => {
  res.render('register', { user: userDb[req.session.userID] });
});

router.post('/register', (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = isUser(email, userDb);

  if (!email || !password) {
    return res.status(400).send('Incorret Email or Password Entered');
  }

  if (user) {
    return res.status(400).send('Email already registered');
  }

  registerUser(id, email, hashedPassword, userDb);

  req.session.userID = id;
  res.redirect('/urls');
});

//=============
//   LOGIN
//=============

router.get('/login', (req, res) => {
  res.render('login', { user: userDb[req.session.userID] });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = isUser(email, userDb);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send('Invalid email/password');
  }

  req.session.userID = user.id;
  res.redirect('/urls');
});

//=============
//   LOGOUT
//=============

router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

module.exports = router;