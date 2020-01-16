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



  router.get('/enterBalance', function(req, res){
    console.log("balance 진입")
    res.render('enterBalance');
  })


  router.post('/enterBalance', auth, function(req, res){ // 회사 계좌 잔액 조회
      var userData = req.decoded;
      var finusenum = req.body.fin_use_num;

      console.log("띠옹")
      console.log(jwt+"############################################")
      console.log(userData.userId+"############################################")
      console.log(userData.userCode+"############################################")

      var sql ="SELECT accessToken1, finUsenum FROM fintech"

      connection.query(sql, function(err, result, fields){
          if(err){
              console.error(err);
              throw err;
          }else {
              console.log(result);
              var random = Math.floor(Math.random() * 1000000000) + 1;    
              var ranId = "T991605830U" + random; //개인 이용기관 코드 넣어야 함!
              var option = {
                  method: 'GET',
                  url: 'https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num',
                  
                  headers: {
                    'Authorization': 'Bearer ' + result[0].accessToken1
                  },
                  qs : {
                      
                      bank_tran_id : ranId,
                      fintech_use_num : result[0].finUsenum,
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
  module.exports = router;