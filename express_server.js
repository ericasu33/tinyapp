const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');

const generateRandomString = () => {
  const randomChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(6)].reduce(a => a + randomChar[~~(Math.random() * randomChar.length)],'');
};

const isUrl = str => {
  const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
};

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("views"));

//BREAD

//----BROWSE----

//Home
app.get('/', (req, res) => {
  res.send('Hello!');
});

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

// app.get('/hello', (req, res) => {
//   res.send('<html><body>Hello <b> World </b></body></html>\n');
// });

//Index Page
app.get('/urls', (req, res) => {
  const templateVar = { urls: urlDatabase };
  res.render('urls_index', templateVar);
});

//Shorten New URL Page
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//----READ----

//Individual shortened URL Page
app.get('/urls/:shortURL', (req, res) => {
  const templateVar = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };

  if (templateVar.longURL === undefined) {
    res.status(404).render('error_404');
    // res.redirect('error');   //-> why we don't need /urls/ here?
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

//Redirected page for invalid URL
app.get('/urls/invalidURL', (req, res) => {
  res.render('error_invalidURL');
});

//-----EDIT-----

//-----ADD-----
//Adds the new shorten URL to the database
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  if (longURL.startsWith('http')) {
    urlDatabase[shortURL] = longURL;
  } else {
    urlDatabase[shortURL] = `http://${longURL}`;
  }

  if (!isUrl(urlDatabase[shortURL])) {
    res.redirect('/urls/invalidURL');
  } else {
    res.redirect(`/urls/${shortURL}`);
  }

});

//-----DELETE-----
//
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]; //=> create a separate function?
  res.redirect('/urls');
});
app.use((req, res) => {
  res.status(404).render('error_404');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});