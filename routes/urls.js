const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { generateRandomString, isUrl, urlDatabase, userDb } = require('../helper');

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.cookies.user_id) {
    res.locals.user = req.cookies.user_id;
    res.locals.email = userDb[res.locals.user].email;
  } else {
    req.cookies = {
      user_id: null,
      email: null,
    };
  }
  next();
});

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
  const templateVar = {
    urls: urlDatabase,
  };
  res.render('urls_index', templateVar);
});

//Shorten New URL Page
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//----READ----

//Redirected page for invalid URL
app.get('/urls/invalidURL', (req, res) => {
  res.render('error_invalidURL');
});

//Individual shortened URL Page
app.get('/urls/:shortURL', (req, res) => {
  const templateVar = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  
  if (templateVar.longURL === undefined) {
    res.status(404).render('error_404');
  } else {
    res.render('urls_show', templateVar);
  }
});

//Redirects user to the original URL page linked to the shortURL
app.get('/u/:shortURL', (req, res) => {
  const templateVar = {
    longURL: urlDatabase[req.params.shortURL]
  };

  if (templateVar.longURL === undefined) {
    res.status(404).render('error_404');
  } else {
    res.redirect(templateVar.longURL);
  }
});


//-----EDIT-----
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

  if (!isUrl(longURL)) {
    res.redirect('/urls/invalidURL');
  } else {
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
  }
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
    res.redirect('/urls/invalidURL');
  } else {
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`);
  }

});

//-----DELETE-----
//Removes the shortened URL from the index
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


//Shows 404 Error
app.use((req, res) => {
  res.status(404).render('error_404');
});
