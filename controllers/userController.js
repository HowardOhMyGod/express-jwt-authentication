var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var config = require('../config');

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

// Register new user on POST
exports.register_post = function(req, res) {
    // extract req.body fields to create user
    let user = (({
        name, user, pwd, role
    }) => ({name, user, pwd, role}))(req.body);

    // check if exist
    User.findOne({user: user.user}).then((doc) => {
        if (doc) {
            return Promise.reject({
                status: false,
                error: 'User has been already exist.'
            })

        } else {
            // hash password
            user.pwd = bcrypt.hashSync(user.pwd, config.salt);

            user = new User(user);

            // save new user to db
            return user.save();
        }
    }).then((doc) => {
        console.log(doc);
        res.status(201).send({
            status: true,
            error: ''
        });
    }).catch((e) => {
        res.status(500).send(e);
    });
};

// Login user on POST
exports.login_post = function(req, res) {
    // get login info from req.body
    let loginInfo = (({
        user, pwd
    }) => ({user, pwd}))(req.body);

    let userInfo = {};
    let token = '';

    // hash pwd to searah in db
    loginInfo.pwd = bcrypt.hashSync(loginInfo.pwd, config.salt);

    // find user in db
    User.findOne(loginInfo).then((doc) => {
        // if found, create jwt token
        if (doc) {
            userInfo = (({
                name, user, role
            }) => ({name, user, role}))(doc);

            // sign token
            return jwt_sign(userInfo, config.secret);
        // user not found
        } else {
            return Promise.reject({
                status: false,
                error: 'User not found.'
            })
        }
    }).then((token) => {
        // set client clientSessions
        if (! req.sessions.token) {
            req.sessions.token = token;
        }

        res.status(200).send({
            user: userInfo.user,
            name: userInfo.name,
            role: userInfo.role
        });
    }).catch((e) => {
        res.status(400).send(e);
    })
}
