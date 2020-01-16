var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var jwt = require('jsonwebtoken');
var request =require('request'); //다 넣어줘야함

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

//get 필요
router.get('/enterTransaction', function(req, res){
  res.render('enterTransaction');
})


// router.post('/enterTransaction', auth, function(req, res){   //회사 거래내역조회 
//     var userData = req.decoded  ;
//     var finusenum = req.body.fin_use_num;

//     var sql = "SELECT * FROM user WHERE id = ?"
//     connection.query(sql, [userData.userId], function(err, result){
//         if(err){
//             console.error(err);
//             throw err;
//         }else {
         
//           console.log(result);
//             var random = Math.floor(Math.random() * 1000000000) + 1;    
//             var ranId = "T991604370U" + random;
//             var options = {
//                 method: 'GET',
//                 url: 'https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num',
//                 headers: {
//                   Authorization: 'Bearer ' + result[0].accesstoken
//                 },
//                 qs : {
//                     bank_tran_id : ranId,
//                     fintech_use_num : finusenum,
//                     inquiry_type :'A',
//                     inquiry_base:'D',
//                     from_date : '20190101',
//                     to_date : '20190110',
//                     sort_order :'D',
//                     tran_dtime : '20200110102959'
//                 }
//               }
//               request(options, function (error, response, body) { 
//                 console.log(body);
//                 var parseData = JSON.parse(body);
//                 res.json(parseData);
//               })
              
//         }
// })
// })


router.post('/enterTransaction', auth, function(req, res){   //회사에서 거래내역조회 
  var userData = req.decoded  ;
  var finusenum = req.body.fin_use_num;

  var sql = "SELECT * FROM transcation WHERE id = ?"
  connection.query(sql, [userData.enterpriseID], function(err, result){
      if(err){
          console.error(err);
          throw err;
      }else {
        console.log('The result is: ', results);
        console.log('sql is ', this.sql);
        res.json(results);     
      }
})
})

module.exports = router;
