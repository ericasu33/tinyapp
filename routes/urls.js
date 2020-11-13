const express = require('express');
const app = express();

const { generateRandomString, isUrl, urlDatabase, userDb, urlsForUser } = require('../helper');

//===============
//   Middleware
//===============

const notLoggedIn = (req, res, next) => {
  const userID = req.session.userID;
  if (!userDb[userID]) {
    return res.redirect('/login');
  }
  next();
};

//================================
//   Error - Invalid/Unauthorized
//================================

app.get('/urls/invalidURL', (req, res) => {
  res.render('error_invalidURL', { user: userDb[req.session.userID] });
});

app.get('/unauthorized', (req, res) => {
  res.render('error_unauthorized', { user: userDb[req.session.userID] });
});

//=============
//   HOME
//=============

app.get('/', notLoggedIn, (req, res) => {
  res.redirect('/urls');
});

//===============
//   URL Index
//===============

//URL index with URLs that's linked to logged-in user's ID
app.get('/urls', (req, res) => {
  const userID = req.session.userID;

  if (!userDb[userID]) {
    return res.status(401).redirect('/unauthorized');
  }

  const urls = urlsForUser(userID, userDb, urlDatabase);

  const templateVar = {
    urls,
    user: userDb[userID],
  };

  res.render('urls_index', templateVar);
});

//===============
//   New URL
//===============

//Shorten New URL Page
app.get('/urls/new', notLoggedIn, (req, res) => {
  const userID = req.session.userID;

  res.render('urls_new', { user: userDb[userID] });
});

//Adds newly shortened URL to the database
app.post('/urls', (req, res) => {
  const userID = req.session.userID;
  const shortURL = generateRandomString();
  let longURL = req.body.longURL;

  const longDate = new Date();
  const date = longDate.toLocaleString();

  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }

  if (!isUrl(longURL)) {
    return res.redirect('/urls/invalidURL');
  }

  //links the shortened URL by userID
  urlDatabase[shortURL] = { longURL, userID, date };
  res.redirect(`/urls/${shortURL}`);
});

//====================
//   Tiny URL Display
//====================

//Individual shortened URL Page
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;

  //not logged in
  if (!userDb[userID]) {
    return res.status(401).redirect('/unauthorized');
  }

  //prevent logged-in user from directly entering random value in the browser
  if (urlDatabase[shortURL] === undefined) {
    return res.status(404).render('error_404');
  }

  //logged in but using another user's :shortURL
  if (userID !== urlDatabase[shortURL].userID) {
    return res.status(401).redirect('/unauthorized');
  }

  const templateVar = {
    user: userDb[userID],
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    date: urlDatabase[shortURL].date
  };

  res.render('urls_show', templateVar);
});

//================================
//   Tiny URL -> Original Website
//================================

//Redirects user to the original website linked to the shortURL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL] === undefined) {
    return res.status(404).render('error_404');
  }

  const templateVar = {
    longURL: urlDatabase[shortURL].longURL
  };

  res.redirect(templateVar.longURL);
});

//=================
//   Edit URL
//=================

//edits the longURL thats assigned to a shortURL
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

  if (!userDb[req.session.userID]) {
    return res.status(401).send('Unauthorized');
  }

  if (!isUrl(longURL)) {
    return res.redirect('/urls/invalidURL');
  }

  urlDatabase[shortURL].longURL = longURL;
  res.redirect('/urls');
});

//=================
//   Delete URL
//=================

//Removes the shortened URL from the index
app.post('/urls/:shortURL/delete', (req, res) => {
  if (!userDb[req.session.userID]) {
    return res.status(401).send('Unauthorized');
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//=================
//   404 Error
//=================
app.use((req, res) => {
  res.status(404).render('error_404');
});

module.exports = app;