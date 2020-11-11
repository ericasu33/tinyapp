const express = require('express');
const app = express();
const PORT = 8080;

const urls = require('./routes/urls');
const authentication = require('./routes/authentication');

app.use(authentication);
app.use(urls);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

