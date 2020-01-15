// users / signup 같은 걸 넣음

var express = require('express');
var router = express.Router();


var mysql = require('mysql');

// my sql 셋팅
var config = require('../../config/config.json');
var connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password, // 본인 비번 쓰기!
  database: config.database
});
connection.connect();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/franSignup', function(req, res){
  res.render('franSignup');
})

router.get('/franLogin', function(req, res){
  res.render('franLogin');
})


router.post('/franSignup', function(req, res){
  console.log(req.body);
  var entCode = req.body.franCode;
  var name = req.body.name;
  var ID = req.body.franId;
  var PW = req.body.franPw;
  var CODE = Math.floor(Math.random()*100)+1; // 가맹점 코드
  console.log(CODE);
  var sql = "INSERT INTO fintech.franchise (franchiseCode, name, franId, franPw) VALUES (?, ?, ?, ?)";
  connection.query(sql, [CODE, name, ID, PW], function (error, results, fields) {
      if (error) throw error;
      console.log('The result is: ', results);
      console.log('sql is ', this.sql);
      res.json(1);
  });
})

router.post('/franLogin', function(req, res){
  var userID = req.body.franId;
  var userPassword = req.body.franPw;
  var sql = "SELECT * FROM fintech.franchise WHERE franId = ?";
  connection.query(sql, [userID], function (error, results, fields) {
      if (error) throw error;
      console.log(results[0].franPw, userPassword);
      if(results[0].franPw == userPassword){    // approved = 0(미승인), 1(승인) 
          console.log(results);
          res.json(results);
      }
      // else if (results[0].approved != '1') {
      //     console.log('미승인 계좌입니다.');
      //     res.json(1);
      // }
      else{
          console.log('비밀번호 틀렸습니다.');
          res.json(0);
      }    
  });
})

module.exports = router;
