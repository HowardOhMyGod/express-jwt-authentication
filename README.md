# express-jwt-authentication

## Authentication Mechanism

### Register Account, POST /user/register
1. Server accepts user register account on POST /register
2. Check if user has already existed in mongoDB
3. If not, saves user's information with hash password or response http error

### User Login, POST /user/login
1. User provides account and password to login in
2. Server checks account and hashed password in db
3. If found user, sign a jwt with account info and set expiration to 5 minutes
4. Then, set token in req.sessions.token using client-sessions

### API Authentication
1. When user requests /api, the browser will automatically bring session cookie which contains token to server
2. Server check if the token can be verified or has been expired
3. If the token pass, server will grant to provide api services


## Project Structure
```yml
- root_folder
    - controllers # functions for /routes http methods
    - middleware # express middleware
    - models # mongodb's model for /controllers
    - routes # routes setting for app.js
    app.js
```
## Package
```javascript
"dependencies": {
  "bcrypt": "^2.0.0", // hash password
  "body-parser": "^1.18.2", // http request body parser
  "client-sessions": "^0.8.0", // store session cookie in client
  "express": "^4.16.3", // our server
  "jsonwebtoken": "^8.2.1", // sign and verigy jwt
  "mongoose": "^5.0.15" // mongodb controller
}
```

## Session Cookie Setting
```javascript
app.use(clientSessions({
    cookieName: 'sessions', // cookie name, and use req.sessions to set value
    secret: 'howardisgood',
    duration: 5 * 60 * 1000, // how long the session will stay valid in ms
    cookie: {
        path: '/api', // cookie will only be sent to requests under '/api'
        maxAge: 5 * 60 * 1000,
        httpOnly: true, // when true, cookie is not accessible from javascript
        ephemeral: false // when true, cookie expires when the browser closes
    }
}))
```
## JWT sign function
```javascript
var jwt_sign = function(payload, secret) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, {
            expiresIn: 5 * 60
        }, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}
```

## JWT verify middleware
```javascript
var jwtVerify = function(req, res, next) {
    let token = req.sessions.token;

    // decode jwt token
    jwt.verify(token, config.secret, (err, payload) => {
        console.log(payload);
        // if decode fail or the token is expired
        if (err || payload.ext < Date.now() / 1000) {
            res.status(401).send({
                "error": "Unauthorized"
            });
        // add payload to req
        } else {
            req.payload = payload;
            next();
        }
    });
}
```

## MongoDB user schema
```javascript
var userSchema = new mongoose.Schema({
    user: String,
    pwd: String,
    role: String,
    name: String
});
```
## Reference
[以 JSON Web Token 替代傳統 Token](https://yami.io/jwt/)
[Where to Store your JWTs – Cookies vs HTML5 Web Storage](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)
[10 Things You Should Know about Tokens](https://auth0.com/blog/ten-things-you-should-know-about-tokens-and-cookies/)
[Using secure client-side sessions to build simple and scalable Node.JS applications – A Node.JS Holiday Season, part 3](https://hacks.mozilla.org/2012/12/using-secure-client-side-sessions-to-build-simple-and-scalable-node-js-applications-a-node-js-holiday-season-part-3/)
[Express Tutorial Part 4: Routes and controllers](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)
