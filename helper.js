const monk = require('monk');
const db = monk('mongodb+srv://esu:esu@cluster0.xgmdr.mongodb.net/tinyurl?retryWrites=true&w=majority');
// npm install dotenv
// require('dotenv').config();
// const db = monk(process.env.MONGO_URI)
const urlDatabase = db.get('urls');
urlDatabase.createIndex({ shortURL: 1 }, { unique: true });

const userDb = db.get('users');
userDb.createIndex({ userID: 1 }, { unique: true });
userDb.createIndex({ email: 1 }, { unique: true });

const generateRandomString = () => {
  const randomChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(6)].reduce(a => a + randomChar[~~(Math.random() * randomChar.length)],'');
};

//verify if URL is valid (not 100% false proof)
const isUrl = str => {
  const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
};

// const urlDatabase = {
//   'b2xVn2': {
//     longURL: 'http://www.lighthouselabs.ca',
//     userID:'aJ481w',
//     date: 'dd/mm/yy 00:00:00',
//     totalVisit: 1,
//     uniqueVisit: 1,
//     visits: [ {
//       visitorID: 'abc',
//       uniqueVisitTime: 'dd/mm/yy 00:00:00'
//     },
//     {
//       visitorID: 'abc',
//       uniqueVisitTime: 'dd/mm/yy 00:00:00'
//     },]
//   },
// };

// userDB = { userID, email, password };
// const userDb = {};

const registerUser = async(userID, email, password, userDatabase) => {
  const user = { userID, email, password };
  const created = await userDatabase.insert(user);
  return created;
};

//check if user exists and returns user details
const isUser = async(email, userDatabase) => {
  const user = await userDatabase.findOne({ 'email': email });
  return user;
};

const urlsForUser = async(userID, urlDatabase) => {
  const urls = await urlDatabase.find({ userID });
  return urls;
};

const getUser = async(userID, userDatabase) => {
  const user = await userDatabase.findOne({ userID });
  return user;
};

module.exports = {
  generateRandomString,
  isUrl,
  registerUser,
  isUser,
  urlsForUser,
  getUser,
  urlDatabase,
  userDb,
};