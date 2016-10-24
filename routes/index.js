var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Comment = require('../models/comment');
var Blog = require('../models/blog')
var router = express.Router();


router.get('/', function (req, res) {
    // res.render('index', { user : req.user,title:'My blog' });
    if (req.user) {

       Blog.find({}).sort('-recommend').limit(5).exec((err, blogs) => { 
            if (err) {
                console.log(err);
               
            } else {
                Blog.find({author: req.user._id}).sort('-time').exec((err,docs) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('index',{user :req.user, title: 'My blog', blog:docs, blogs: blogs});
                    }
                });
            }
        });

    } else {

        Blog.find({}).sort('-recommend').limit(5).exec((err, docs) => {
            console.log('---查找热门文章---------------------------------');      
            if (err) {
                console.log(err);
            } else {
                res.render('index', { user : req.user,title:'My blog', blogs:docs });
            }
        });     
    }

});

router.get('/blog',function(req,res,next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        // res.redirect('/');
    });
    res.render('blog', { user : req.user,title:'Show blog' });
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

router.post('/addblog',function(req,res,next) {
    var time = new Date();
    var title = req.body['title'];
    var content = req.body['content'];

    var blog = new Blog({
    title: title,
    content: content,    //博客内容
    author: req.user, //作者，定义外键
    time : time, //博客发布时间
    recommend: 0,   //博客被赞次数
    });
    
    blog.save(function(err, res) {
        if (err) {
            console.log("- - - - - - - - - - 博客发布失败 - - - - - - - - - - - - - - - - - - -");
        }

        console.log("- - - - - - - - - - 博客发布成功 - - - - - - - - - - - - - - - - - - - - -");  

    });
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
