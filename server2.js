var request = require('request');
var express = require("express");
var jwt = require('jsonwebtoken');
var tokenKey = "fintechAcademy0$1#0@6!";
var auth = require('./lib/auth');
app = express();
var port = process.env.PORT || 3001;

// 다른 사용자들에게 보여줄 파일들이 있는 폴더. 공개용 폴더.
// 이게 없으면 보여주고 싶은 정보들(이미지, 코드)이 그 자체가 아니라 경로, 코드로 보여짐.
app.use(express.static(__dirname + '/public')); 

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '', // 본인 비번 쓰기!
  database : 'fintech'
});

connection.connect();


app.get('/signup', function(req, res){
    res.render('signup');
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/main', function(req, res){
    res.render('main');
})

app.get('/qrcode', function(req, res){
    res.render('qrcode');
})

app.get('/qrReader', function(req, res){
    res.render('qrReader');
})

// -------------------- post ---------------------//

app.post('/user', function(req, res){
    console.log(req.body);
    var entCode = req.body.entCode;
    var name = req.body.name;
    var ID = req.body.ID;
    var PW = req.body.password;

    var sql = "INSERT INTO fintech.enterprise (enterpriseCode, name, ID, PW) VALUES (?, ?, ?, ?)";
    connection.query(sql, [entCode, name, ID, PW], function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        console.log('sql is ', this.sql);
        res.json(1);
    });
})

app.post('/login', function(req, res){
    var entCode = req.body.entCode;
    var userID = req.body.ID;
    var userPassword = req.body.password;
    var sql = "SELECT * FROM fintech.enterprise WHERE ID = ?";
    connection.query(sql, [userID], function (error, results, fields) {
        if (error) throw error;
        console.log(results[0].PW, userPassword);
        if(results[0].PW == userPassword && results[0].approved == "1"){    // approved = 0(미승인), 1(승인) 
            console.log(results);
            res.json(results)
        }
        else if (results[0].approved != '1') {
            console.log('미승인 계좌입니다.');
            res.json(1);
        }
        else{
            console.log('비밀번호 틀렸습니다.');
            res.json(0);
        }    
    });
})

app.listen(port);

console.log("Listening on port ", port);