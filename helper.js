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

const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID:'aJ481w' },
  '9sm5xK': { longURL: 'http://www.google.com', userID:'aJ481W'},
};

// userDB = { id: { id, email, password} }
const userDb = {};

const registerUser = (id, email, password, userDatabase) => {
  const user = { id, email, password };
  return userDatabase[id] = user;
};

//check if user exists and returns user details
const isUser = (email, userDatabase) => {
  let registered;
  for (const id in userDatabase) {
    if (userDatabase[id].email === email) {
      registered = userDatabase[id];
    }
  }
  return registered;
};


const urlsForUser = (userID, userDatabase, urlDatabase) => {
  let urlDbByUser = {};

  for (const shortURL in urlDatabase) {
    const {longURL, date} = urlDatabase[shortURL];

    if (userDatabase[userID].id === urlDatabase[shortURL].userID) {
      urlDbByUser[shortURL] = { longURL, date };
    }
  }
  return urlDbByUser;
};

module.exports = {
  generateRandomString,
  isUrl,
  urlDatabase,
  userDb,
  registerUser,
  isUser,
  urlsForUser,
};