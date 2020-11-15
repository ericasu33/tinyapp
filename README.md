# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

Deployed Website: https://ericasu-tinyurlapp.herokuapp.com/login

## Final Product

!["screenshot of Sign Up Page"](https://github.com/ericasu33/tinyapp/blob/master/docs/signup-page.png?raw=true)
!["screenshot of URL Index Page"](https://github.com/ericasu33/tinyapp/blob/master/docs/urls-page.png?raw=true)
!["screenshot of URL Show Page"](https://github.com/ericasu33/tinyapp/blob/master/docs/url-show-page.png?raw=true)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override
- monk

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` or `npm start` command.

- In the browser, input `http://localhost:8080/` as the URL address.

## Functions
- Registration/Login required to access the Tiny URL App.
- Index page with all the URLs you have shortened so far.
- You can edit the given shortenURL 's ID with another URL.
- You  can also delete any of the created URLs in your index page.
- Tracks timestamp of when URLs are shortened

## Analytics
- Tracks total visits to the shortened URL link
- Tracks unique visitor + timestamp

## Notes
- This website does not utilize responsive web design 

## Contribution
- lippy: with setting Mongo Database.
