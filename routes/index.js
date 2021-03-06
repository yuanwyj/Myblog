var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Comment = require('../models/comment');
var Blog = require('../models/blog')
var router = express.Router();
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var multipart = require('connect-multiparty');

var cipher = crypto.createCipher('aes192', new Buffer('my password'));
var decipher = crypto.createDecipher('aes192', new Buffer('my password'));

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
                res.render('index', { user : req.user,title:'My blog', blogs:docs});
            }
        });     
    }

});

router.get('/blog/:blogId',function(req,res,next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);

        }
    });    

    Blog.findById(req.params.blogId).populate('author').exec((err,blog) =>{
        console.log('---查看博客---------------------------------');
        if (err) {
            console.log(err);
            return next(err);
        } else {
            Comment.find({blog:req.params.blogId}).exec((err,comments) =>{
                if (err) {
                    console.log(err);
                } else if(comments.length == 0) {
                    res.render('blog', { user : req.user,title:'Show blog',blog :blog,comments });
                } else {
                    Comment.find({blog:req.params.blogId}).populate('author').exec((err,comments) =>{
                        if (err) {
                            console.log(err);                 
                        } else {
                            console.log("+++++++++",comments[0].author.username);
                            res.render('blog', { user : req.user,title:'Show blog',blog :blog,comments:comments });

                        }
                    });                     
                }
            });
          
        }
    });
});

router.post('/comment/:blogId',function(req,res,next) {
    var time = new Date();
    var content = req.body['comment'];

    var comment = new Comment({
        author: req.user,
        content: content,
        blog: req.params.blogId,
        time: time,
        recommend: 0
    }); 

    comment.save(function(err,res) {
        if (err) {
            console.log("- - - - -评论发布失败 - - - - - - - - - -  - - - -");
            console.log(err);
        } 
        console.log("- - - - - 评论发布成功 - - - - - - - - - - - - - -")
   
    });

    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/blog/'+ req.params.blogId);
    });

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
router.post('/zanblog/:blogId',function(req,res,next) {

    Blog.update({'_id':req.params.blogId},{'$inc':{'recommend':1}},function(err,blog) {
        if (err) {
            console.log(err);
        } else {
            console.log("点赞成功");
        }
    });
});

router.post('/search/:blogInfo',function(req,res,next) {
    // 模糊查询blog
    var re = new RegExp(req.params.blogInfo, 'i');
    Blog.find().or([{ 'title': { $regex: re }}]).limit(5).sort('-recommend').exec(function(err, blogs) {
        if (err) {
            console.log(err);
        }
        res.json(blogs);
        console.log(blogs);
    });
});

router.post('/commendzan/:commendId',function(req,res,next) {
    Comment.update({'_id':req.params.commendId},{'$inc':{'recommend':1}},function(err,comment) {
        if (err) {
            console.log(err);
        } else {
            console.log("点赞成功");
        }
    });
});
router.post('/setkeyt',function(req,res,next) {

    var setkeyt = req.body['setkeyt'];
    var sha512 = crypto.createHash('sha512');    
    setkeyt = sha512.update(setkeyt).digest('hex');

    User.update({'_id':req.user._id},{'keyt':setkeyt},function(err,user) {
        if (err) {
            console.log(err);
        } else {
            req.session.save(function (err) {
                if (err) {
                    return next(err);

                }
            });   
                     
            console.log("设置密码成功.");

            // 显示服务器文件 
            // 文件目录
            var filePath = path.join(__dirname, '../public/upload');
            fs.readdir(filePath, function(err, results){
              if(err) throw err;
              if(results.length>0) {
                var files = [];
                results.forEach(function(file){
                  if(fs.statSync(path.join(filePath, file)).isFile()){
                    files.push(file);
                  }
                })
                res.render('fires', {files:files});
              } else {
                res.end('当前目录下没有文件');
              }
            });
        }
    });    

});

router.post('/keyt',function(req,res,next) {
    var keyt = req.body['keyt'];
    var sha512 = crypto.createHash('sha512');    
    keyt = sha512.update(keyt).digest('hex');

    User.findById(req.user._id).exec((err,user) =>{
        if (err) {
            console.log(err);
        } else {
            if (user.keyt == keyt) {
                console.log("密码正确，进入私人空间");
             // 显示服务器文件 
            // 文件目录
                var filePath = path.join(__dirname, '../public/upload');
                fs.readdir(filePath, function(err, results){
                  if(err) throw err;
                  if(results.length>0) {
                    var files = [];
                    results.forEach(function(file){
                      if(fs.statSync(path.join(filePath, file)).isFile()){
                        files.push(file);
                      }
                    })
                    res.render('fires', {files:files});
                  } else {
                    res.end('当前目录下没有文件');
                  }
                });               
            } else {
                console.log("密码错误");
                res.redirect('/');
            }
        }
    });
});
router.get('/file/:fileName', function(req, res, next) {

    var decrypted = "";
    var decipher = crypto.createDecipher('aes192', new Buffer('my password'));

    // 实现文件下载 
    var fileName = req.params.fileName;
    var filePath = path.join(__dirname, '../public/upload/',fileName);
    var stats = fs.statSync(filePath); 
    var data = '';
    if(stats.isFile()){
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename='+fileName,
        'Content-Length': stats.size
      });
        var s = fs.createReadStream(filePath);
        // var writerStream = fs.createWriteStream(res);

        s.on('data',function(d){
            console.log("d"+ d);
            data += d;
            console.log("data:" + data);
        });
        s.on('end',function() {
            decrypted += decipher.update(data, 'hex','utf8');
            decrypted += decipher.final('utf8');  

            console.log("解密后:" + decrypted);
            res.send(decrypted);
        });
        // s.pipe(res);
    } else {
      res.end(404);
    }
});

router.post('/upload', multipart(), function(req, res,next){

    //get filename
    var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
    //copy file to a public directory
    // var targetPath = path.dirname(__filename) + '/upload/' + filename;

    var targetPath = path.join(__dirname,'../' + '/public/upload/' + filename);
    //copy file
    var s = fs.createReadStream(req.files.files.ws.path);
    s.on('data',function(d){
        cipher.update(d);
    });
    s.on('end',function() {
        var d = cipher.final().toString('hex');
        fs.writeFile(targetPath,d,function(err,data) {
            if (err) {
                console.log("文件写入数据发生错误：" + err);
            } else {
                console.log("加密数据: " + data);
            }      
        });     
    });
    // s.pipe(fs.createWriteStream(targetPath));
    // fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
    //return file url
    res.json({code: 200, msg: {url: '../upload/' + filename}});
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
module.exports = router;