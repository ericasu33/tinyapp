const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { generateRandomString, registerUser, isUser, userDb, getUser } = require('../helper');

//================================
//   Error - Invalid/Unauthorized
//================================

router.get('/forbidden', async(req, res) => {
  res.render('./errorPages/error_registerLogin', { user: await getUser(req.session.userID, userDb) });
});

//=============
//   Register
//=============

router.get('/register', async(req, res) => {
  res.render('register', { user: await getUser(req.session.userID, userDb) });
});

router.post('/register', async(req, res) => {
  const userID = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await isUser(email, userDb);

  if (!email || !password) {
    return res.status(403).redirect('/forbidden');
  }

  if (user) {
    return res.status(403).redirect('/forbidden');
  }

  await registerUser(userID, email, hashedPassword, userDb);

  req.session.userID = userID;
  res.redirect('/urls');
});

//=============
//   LOGIN
//=============

router.get('/login', async(req, res) => {
  res.render('login', { user: await getUser(req.session.userID, userDb) });
});

router.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const user = await isUser(email, userDb);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).redirect('/forbidden');
  }

  req.session.userID = user.userID;
  res.redirect('/urls');
});

//=============
//   LOGOUT
//=============

router.post('/logout', async(req, res) => {
  req.session = null;
  res.redirect('/urls');
});

module.exports = router;