const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const morgan = require('morgan');

router.use(morgan('dev'));
router.use(methodOverride('_method'));

const { generateRandomString, isUrl, urlDatabase, userDb, urlsForUser, getUser } = require('../helper');


//===============
//   Middleware
//===============

const notLoggedIn = async(req, res, next) => {
  const user = await getUser(req.session.userID, userDb);
  if (!user) {
    return res.redirect('/login');
  }
  next();
};

//================================
//   Error - Invalid/Unauthorized
//================================

router.get('/urls/invalidURL', async(req, res) => {
  res.render('./errorPages/error_invalidURL', { user: await getUser(req.session.userID, userDb) });
});

router.get('/unauthorized', async(req, res) => {
  res.render('./errorPages/error_unauthorized', { user: await getUser(req.session.userID, userDb) });
});

//=============
//   HOME
//=============

router.get('/', notLoggedIn, async(req, res) => {
  res.redirect('/urls');
});

//===============
//   URL Index
//===============

//URL index with URLs that's linked to logged-in user's ID
router.get('/urls', async(req, res) => {
  const userID = req.session.userID;
  const user = await userDb.findOne({userID});
  if (!user) {
    return res.status(401).redirect('/unauthorized');
  }

  const urls = await urlsForUser(userID, urlDatabase);

  const templateVar = {
    urls,
    user: await userDb.findOne({userID}),
  };

  res.render('urls_index', templateVar);
});

//===============
//   New URL
//===============

//Shorten New URL Page
router.get('/urls/new', notLoggedIn, async(req, res) => {
  res.render('urls_new', { user: await getUser(req.session.userID, userDb) });
});

//Adds newly shortened URL to the database
router.post('/urls', async(req, res) => {
  const userID = req.session.userID;
  const shortURL = generateRandomString();
  let longURL = req.body.longURL;
  const totalVisit = 0;
  const uniqueVisit = 0;
  const visits = [];

  const longDate = new Date();
  const date = longDate.toGMTString();

  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }

  if (!isUrl(longURL)) {
    return res.redirect('/urls/invalidURL');
  }

  //links the shortened URL by userID
  await urlDatabase.insert({ shortURL, longURL, userID, date, totalVisit, uniqueVisit, visits });
  res.redirect(`/urls/${shortURL}`);
});

//====================
//   Tiny URL Display
//====================

//Individual shortened URL Page
router.get('/urls/:shortURL', async(req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;

  //not logged in
  const user = await getUser(userID, userDb);
  if (!user) {
    return res.status(401).redirect('/unauthorized');
  }

  //prevent logged-in user from directly entering random value in the browser
  const url = await urlDatabase.findOne({ shortURL });
  if (!url) {
    return res.status(404).render('./errorPages/error_404');
  }

  //logged in but using another user's :shortURL
  if (userID !== url.userID) {
    return res.status(401).redirect('/unauthorized');
  }
  
  const { longURL, date, totalVisit, uniqueVisit, visits } = await urlDatabase.findOne({ shortURL });
  const templateVar = {
    user: await userDb.findOne({ userID }),
    shortURL,
    longURL,
    date,
    totalVisit,
    uniqueVisit,
    visits,
  };

  res.render('urls_show', templateVar);
});

//================================
//   Tiny URL -> Original Website
//================================

//Redirects user to the original website linked to the shortURL
router.get('/u/:shortURL', async(req, res) => {
  const shortURL = req.params.shortURL;
  const url = await urlDatabase.findOne({ shortURL });
  if (!url) {
    return res.status(404).render('./errorPages/error_404');
  }

  //tracks total time visited
  let mongoset = {};
  mongoset['$inc'] = { totalVisit: 1 };

  //tracks unique visitors
  if (!req.session.visitorID) {
    req.session.visitorID = generateRandomString();
    const visitorID = req.session.visitorID;
    const date = new Date();
    const uniqueVisitTime = date.toGMTString();

    mongoset['$addToSet'] = { visits: { uniqueVisitTime, visitorID } };
    mongoset['$inc'] = { uniqueVisit: 1, totalVisit: 1 };
  }

  await urlDatabase.findOneAndUpdate({ shortURL }, mongoset);
  const redirectURL = await urlDatabase.findOne({ shortURL });
  
  res.redirect(redirectURL.longURL);
});

//=================
//   Edit URL
//=================

//edits the longURL thats assigned to a shortURL
router.put('/urls/:shortURL', async(req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const userID = req.session.userID;
  const user = await userDb.findOne({ userID });
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  if (!isUrl(longURL)) {
    return res.redirect('/urls/invalidURL');
  }

  await urlDatabase.findOneAndUpdate({ shortURL }, {$set: { longURL } });
  res.redirect('/urls');
});

//=================
//   Delete URL
//=================

//Removes the shortened URL from the index
router.delete('/urls/:shortURL/delete', async(req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const user = await userDb.findOne({ userID });
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  await urlDatabase.remove({ shortURL });
  res.redirect('/urls');
});

//=================
//   404 Error
//=================

//give 404 if non logged in user enter randomly in the address bar after '/'
router.use(async(req, res) => {
  res.status(404).render('./errorPages/error_404');
});

module.exports = router;