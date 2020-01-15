var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var tokenKey = "fintechAcademy0$1#0@6!";

var mysql = require('mysql');
var config = require('../../config/config.json');

var connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password, // 본인 비번 쓰기!
  database: config.database
});

connection.connect;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res){
  res.render('enterSignup');
})

router.get('/login', function(req, res){
  res.render('enterLogin');
})

router.get('/enterMain', function(req, res){
  console.log("!!!!!!!")
  res.render('enterMain');
})

//-----------post------------//
router.post('/user', function(req, res){ //회사 회원가입 API
  console.log(req.body);
 // var entCode = req.body.entCode;
  var ID = req.body.ID;
  var PW = req.body.password;  
  var CODE = Math.floor(Math.random()*100)+1;
  var sql = "INSERT INTO fintech.enterprise (enterpriseCode, enterpriseID, enterprisePW) VALUES (?, ?, ?)";
  connection.query(sql, [CODE, ID, PW], function (error, results, fields) {
      if (error) throw error;
      console.log('The result is: ', results);
      console.log('sql is ', this.sql);
      res.json(1);
  });
})

router.post('/login', function(req, res){ //회사 로그인 API
  var userID = req.body.ID;
  var userPassword = req.body.password;

  var sql = "SELECT * FROM fintech.enterprise WHERE enterpriseID = ?";
  connection.query(sql, [userID], function (error, results, fields) {
      if (error) throw error;
      console.log(results[0].enterprisePW, results[0].enterpriseCode );
      if(results[0].enterprisePW == userPassword){     
          console.log(results);
          jwt.sign(
              {
                  userId : results[0].enterpriseID,
                  userPW : results[0].enterprisePW,
                  userCode : results[0].enterpriseCode
              },
              tokenKey,
              {
                  expiresIn : '10d',
                  issuer : 'fintech.admin',
                  subject : 'user.login.info'
              },
              function(err, token){
                  console.log('로그인 성공', token)
                  res.json(token)
              }
          )
      }
      else{
          console.log('비밀번호 틀렸습니다.');
          res.json(0);
      }    
  });
})

module.exports = router;