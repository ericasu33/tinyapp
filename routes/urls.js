const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { generateRandomString, isUrl, urlDatabase } = require('../helper');

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


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
    username: req.cookies.username
  };
  res.render('urls_index', templateVar);
});

//Shorten New URL Page
app.get('/urls/new', (req, res) => {
  const templateVar = { username: req.cookies.username };
  res.render('urls_new', templateVar);
});

//----READ----

//Redirected page for invalid URL
app.get('/urls/invalidURL', (req, res) => {
  const templateVar = {
    username: req.cookies.username,
  };

  res.render('../views/error_invalidURL', templateVar);
});

//Individual shortened URL Page
app.get('/urls/:shortURL', (req, res) => {
  const templateVar = {
    username: req.cookies.username,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  
  if (templateVar.longURL === undefined) {
    console.log("HEYYYYYY");
    res.status(404).render('error_404');
  } else {
    res.render('urls_show', templateVar);
  }
});

//Redirects user to the original URL page linked to the shortURL
app.get('/u/:shortURL', (req, res) => {
  const templateVar = { longURL: urlDatabase[req.params.shortURL] };
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
  const longURL = req.body.longURL;

  if (longURL.startsWith('http') && isUrl(urlDatabase[shortURL])) {
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`);
  } else {
    urlDatabase[shortURL] = `http://${longURL}`;
  }

  if (!isUrl(urlDatabase[shortURL])) {
    delete urlDatabase[shortURL];
    res.redirect('/urls/invalidURL');
  } else {
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
