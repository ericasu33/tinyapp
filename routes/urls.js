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

//===========
//   URL
//===========

//----BROWSE----

//Home
app.get('/', (req, res) => {
  res.send('Hello!');
});


//Index Page
app.get('/urls', (req, res) => {
  if (!userDb[req.session.userID]) {
    return res.redirect('/login');
  }

  const urls = urlsForUser(req.session.userID);
  const templateVar = {
    urls,
    user: userDb[req.session.userID],
  };

  res.render('urls_index', templateVar);
});

//Shorten New URL Page
app.get('/urls/new', (req, res) => {
  if (!userDb[req.session.userID]) {
    return res.redirect('/login');
  }

  res.render('urls_new', { user: userDb[req.session.userID] });
});

//----READ----

//Redirected page for invalid URL
app.get('/urls/invalidURL', (req, res) => {

  res.render('error_invalidURL');
});

//Individual shortened URL Page
app.get('/urls/:shortURL', (req, res) => {
  const templateVar = {
    user: userDb[req.session.userID],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };

  if (!userDb[req.session.userID]) {
    return res.redirect('/login');
  }
  
  if (templateVar.longURL === undefined) {
    return res.status(404).render('error_404');
  }

  res.render('urls_show', templateVar);
});

//Redirects user to the original URL page linked to the shortURL
app.get('/u/:shortURL', (req, res) => {
  const templateVar = {
    longURL: urlDatabase[req.params.shortURL].longURL
  };

  if (templateVar.longURL === undefined) {
    return res.status(404).render('error_404');
  }

  res.redirect(templateVar.longURL);
});


//-----EDIT-----
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

//-----ADD-----
//Adds the new shorten URL to the database
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  let longURL = req.body.longURL;

  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }

  if (!isUrl(longURL)) {
    return res.redirect('/urls/invalidURL');
  }

  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = longURL;
  urlDatabase[shortURL].userID = req.session.userID;
  res.redirect(`/urls/${shortURL}`);
});

//-----DELETE-----
//Removes the shortened URL from the index
app.post('/urls/:shortURL/delete', (req, res) => {
  if (!userDb[req.session.userID]) {
    return res.status(401).send('Unauthorized');
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


//Shows 404 Error
app.use((req, res) => {
  res.status(404).render('error_404');
});

module.exports = app;