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

// 출금이체 API
router.post('/withdrawQr', auth, function(req, res) {

    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = 'T991605830U' + countnum; //본인 이용기관 코드 넣어야 함!
    connection.query('select sum(price) total, accessToken1, finUsenum, accessToken2 from fintech, transaction where isPay=0;',  function(//금액도 보내줘야함
      error,
      results,
      fields
    ) {
      console.log(results[0].total);
      if (error) throw error;
      var option = {
        method: 'post',
        url: 'https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num',
        headers: {
          Authorization: 'Bearer ' + results[0].accessToken1 //fintech 테이블의 3-leg 토큰
        },
        json: {
          bank_tran_id: transId,
          cntr_account_type: 'N',
          cntr_account_num: '9958200419',
          dps_print_content: '음식값',
          fintech_use_num: results[0].finUsenum,
          wd_print_content: '음식값',
          tran_amt: results[0].total, // 총액
          tran_dtime: '20200910101921',
          req_client_name: '김정은', // 출금하라고 요청하는 사람 / 사실 내가 받음
          req_client_bank_code: '097',
          req_client_account_num: '9958200419',
          req_client_num: 'HONGGILDONG1234',
          transfer_purpose: 'TR',
          // "sub_frnc_name" : "하위가맹점",
          // "sub_frnc_num" : "123456789012",
          // "sub_frnc_business_num" : "1234567890",
          recv_client_name: '김다인', // 출금하라는 요청을 받았다 / 출금을 하는 주체는 회사
          recv_client_bank_code: '097',
          recv_client_account_num: '1111111111111'
        }
      };
      request(option, function(error, response, body) {
        console.log(body);
        var resultObject = body;
        if (resultObject.rsp_code == 'A0000') {
          res.json(1);
        } else {
          res.json(resultObject.rsp_code);
        }
      });
    });
  });
  
  // 입금이체 API
  router.post('/depositQr', auth, function(req, res) {

    var sql = 'select sum(price) total, accessToken1, finUsenum, accessToken2 from fintech, transaction where isPay=0;'; //금액 넣어야함
    connection.query(sql, function(err, result) {  //가맹점 이름이 fintech테이블의 companyId부분
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log(result);
        var random = Math.floor(Math.random() * 1000000000) + 1;
        var ranId = 'T991605830U' + random; //본인 이용기관 코드 넣어야 함!
        var options = {
          method: 'POST',
          url: 'https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num',
          headers: {
            Authorization: 'Bearer ' + result[0].accessToken2, //fintech 테이블의 2-leg 토큰
            'Content-Type': 'application/json; charset=UTF-8'
          },
          json: {
            cntr_account_type: 'N',
            cntr_account_num: '0460562799',
            wd_pass_phrase: 'NONE',
            wd_print_content: '음식값',
            name_check_option: 'on',
            tran_dtime: '20200110102959',
            req_cnt: '1',
            req_list: [ // 가맹점 1곳이라고 가정. 여러 곳일 때도 가능하게 확장 예정
              {
                tran_no: '1',
                bank_tran_id: ranId,
                fintech_use_num: result[0].finUsenum ,
                print_content: '음식값',
                tran_amt: result[0].total,
                req_client_name: '김정남', 
                req_client_bank_code: '097',
                req_client_account_num: '0460562799',
                req_client_num: 'HONGGILDONG1234',
                transfer_purpose: 'TR'
              }
            ]
          }
        };
        request(options, function(error, response, body) {
          console.log(body);
          var resultObject = body;
          if (resultObject.rsp_code == 'A0000') {
            res.json(1);
          } else {
            res.json(resultObject.rsp_code);
          }
        });
      }
    });
  });
  
  router.post('/isPay', auth, function(req, res) {  //isPay가 0인 id를 뽑는 API

    var sql ="update transaction set isPay=1 where id in (select t.id from (select id from transaction where isPay=0) as t)";   
    
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error(error);
            throw error;
        }else {
            console.log('sql is ', this.sql);
            res.json(results);
        }
    });
  })

//   router.post('/isPay2', auth, function(req, res) {  //isPay가 0인 id의 isPay를 1로 세팅하는 API 

//     var isPay_id = req.body.id;
//     var sql ="UPDATE transaction SET isPay=1 WHERE id = ?";
    
//     connection.query(sql, [isPay_id], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             throw error;
//         }else {
//             console.log('sql is ', this.sql);
//             res.json(results);
//         }
//     });
//   })


  module.exports = router;
  