var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Comment = require('../models/comment');
var Blog = require('../models/blog')
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { user : req.user,title:'My blog' });

});

router.get('/register', function(req, res) {
    res.render('register', {user : req.user, error : req.flash('error'),title:'注册' });
});

router.post('/register', function(req, res, next) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
          return res.render('register', { error : err.message ,title:'注册',user : req.user});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user, error : req.flash('error'),title:'登陆'});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
