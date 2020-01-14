var express = require('express');
var router = express.Router();

// auth가 없을 땐 이걸 써주기..
var auth = require('../lib/auth');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/empSignup', function(req, res){
  res.render('empSignup');
})

router.get('/empLogin', function(req, res){
  res.render('empLogin');
})

router.get('/main', function(req, res){
  res.render('main');
})

router.get('/empQrcode', function(req, res){
  res.render('empQrcode');
})


router.post('/empSignup', function(req, res) {
  console.log(req.body);
  var entCode = req.body.entCode;
  var name = req.body.name;
  var ID = req.body.ID;
  var PW = req.body.password;
  var sql =
    'INSERT INTO fintech.employee (enterpriseCode, name, ID, PW) VALUES (?, ?, ?, ?)';
  connection.query(sql, [entCode, name, ID, PW], function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    console.log('The result is: ', results);
    console.log('sql is ', this.sql);
    res.json(1);
  });
});

router.post('/empLogin', function(req, res) {
  var entCode = req.body.entCode;
  var userID = req.body.ID;
  var userPassword = req.body.password;
  var sql = 'SELECT * FROM fintech.employee WHERE ID = ?';
  connection.query(sql, [userID], function(error, results, fields) {
    if (error) throw error;
    console.log(results[0].PW, userPassword);
    if (results[0].PW == userPassword && results[0].approved == '1') {
      // approved = 0(미승인), 1(승인)
      console.log(results);
      res.json(results);
    } else if (results[0].approved != '1') {
      console.log('미승인 계좌입니다.');
      res.json(1);
    } else {
      console.log('비밀번호 틀렸습니다.');
      res.json(0);
    }
  });
});


router.post('/balance', auth, function(req, res){ // 계좌 잔액 조회
  var userData = req.decoded;
  var finusenum = req.body.fin_use_num;

  var sql ="SELECT * FROM user WHERE id = ?"
  connection.query(sql, [userData.userId], function(err, result){
      if(err){
          console.error(err);
          throw err;
      }
      else {
          console.log(result);
          var random = Math.floor(Math.random() * 1000000000) + 1;    
          var ranId = "T991605830U" + random;
          var option = {
              method: 'GET',
              url: 'https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num',
              headers: {
                'Authorization': 'Bearer ' + result[0].accesstoken
               },
              qs : {
                  
                  bank_tran_id : ranId,
                  fintech_use_num : finusenum,
                  tran_dtime : '20200109145559'
              }
            }
            request(option, function(error,response, body){
              console.log(body);
              var parseData = JSON.parse(body);
              res.json(parseData);
          })  
      }
})
})


router.post('/balancelist', auth, function(req, res){   //거래내역조회 
  var userData = req.decoded;
  var finusenum = req.body.fin_use_num;

  var sql ="SELECT * FROM user WHERE id = ?"
  connection.query(sql, [userData.userId], function(err, result){
      if(err){
          console.error(err);
          throw err;
      }
      else {
          console.log(result);
          var random = Math.floor(Math.random() * 1000000000) + 1;    
          var ranId = "T991605830U" + random;
          var options = {
              method: 'GET',
              url: 'https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num',
              headers: {
                Authorization: 'Bearer ' + result[0].accesstoken
              },
              qs : {
                  bank_tran_id : ranId,
                  fintech_use_num : finusenum,
                  inquiry_type :'A',
                  inquiry_base:'D',
                  from_date : '20190101',
                  to_date : '20190110',
                  sort_order :'D',
                  tran_dtime : '20200110102959'
              }
            }
            request(options, function (error, response, body) { 
              console.log(body);
              var parseData = JSON.parse(body);
              res.json(parseData);
            })
            
      }
})
})

module.exports = router;
