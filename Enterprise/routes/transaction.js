var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var jwt = require('jsonwebtoken');
var request = require('request'); //다 넣어줘야함

var tokenKey = 'fintechAcademy0$1#0@6!';

var mysql = require('mysql');
var config = require('../../config/config.json');

var connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password, // 본인 비번 쓰기!
  database: config.database
});

connection.connect;

//get 필요
router.get('/enterTransaction', function(req, res) {
  res.render('enterTransaction');
});

router.post('/enterTransaction', auth, function(req, res) {
  //회사 거래내역조회
  var userData = req.decoded;
  var finusenum = req.body.fin_use_num;
  console.log("ㅡㅡ");
  console.log(userData);
 
  var sql =
    'SELECT distinct employee.name emp_name,franchise.name fran_name,transaction.enterpriseCode, transaction.menu, transaction.price FROM transaction,franchise,employee WHERE transaction.enterpriseCode = ? and transaction.franID=franchise.franId and transaction.employID=employee.ID and transaction.isPay=0';
  connection.query(sql, [userData.userCode], function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(result);
      res.json(result);
    }
  });
});

module.exports = router;
