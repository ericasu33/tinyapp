const express = require('express');
const app = express();

const { generateRandomString, isUrl, urlDatabase, userDb, urlsForUser } = require('../helper');

// app.use((req, res, next) => {
//   if (req.session.userID) {
//     res.locals.user = req.session.userID;
//     res.locals.email = userDb[res.locals.user].email;
//   } else {
//     req.session = {
//       userID: null,
//       email: null,
//     };
//   }
//   next();
// });

// userDb[req.session.userID] - checks if user is logged in or not.

//=============
//   HOME
//=============

app.get('/', (req, res) => {
  if (userDb[req.session.userID]) {
    return res.redirect('/urls');
  }
  res.redirect('login');
});

//===============
//   URL Index
//===============

//URL index with URLs that's linked to logged-in user's ID
app.get('/urls', (req, res) => {
  const userID = req.session.userID;

  if (!userDb[userID]) {
    return res.redirect('/login');
  }

  const urls = urlsForUser(userID, userDb);

  const templateVar = {
    urls,
    user: userDb[userID],
  };

  console.log(urls);
  res.render('urls_index', templateVar);
});

//===============
//   New URL
//===============

//Shorten New URL Page
app.get('/urls/new', (req, res) => {
  const userID = req.session.userID;

  if (!userDb[userID]) {
    return res.redirect('/login');
  }

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

//================
//   Invalid URL
//================

app.get('/urls/invalidURL', (req, res) => {
  res.render('error_invalidURL', { user: userDb[req.session.userID] });
});

//====================
//   Tiny URL Display
//====================

//Individual shortened URL Page
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;

  if (!userDb[userID]) {
    return res.redirect('/login');
  }

  //prevent logged-in user from directly entering random value in the browser
  if (urlDatabase[shortURL] === undefined) {
    return res.status(404).render('error_404');
  }

  const templateVar = {
    user: userDb[userID],
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
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
  res.redirect(`/urls/${shortURL}`);
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