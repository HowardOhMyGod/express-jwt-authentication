const express = require('express');
const bodyParser = require('body-parser');
const clientSessions = require('client-sessions');

var user = require('./routes/user');
var index = require('./routes/index');
var api = require('./routes/api');


var app = express();

// parse setting
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// client clientSessions
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

// routes
app.use('/', index);
app.use('/user', user);
app.use('/api', api);

app.listen(3000, (err) => {
    console.log('Server listen on port 3000...');
});
