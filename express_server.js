const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urls = require('./routes/urls');
const authentication = require('./routes/authentication');

app.use(authentication);
app.use(urls);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

