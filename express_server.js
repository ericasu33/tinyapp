const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const urls = require('./routes/urls');
const authentication = require('./routes/authentication');

app.use(authentication);
app.use(urls);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

