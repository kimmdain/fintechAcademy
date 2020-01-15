var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var auth = require('../lib/auth');
var request = require('request');

// my sql 셋팅
var config = require('../../config/config.json');
var connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password, // 본인 비번 쓰기!
  database: config.database
});
connection.connect();

router.get('/franQrReader', function(req, res) {
  res.render('franQrReader');
});

// 출금이체 API
router.post('/withdrawQr', auth, function(req, res) {
  var finusenum = req.body.fin_use_num;
  var franId = req.decoded.userId;

  var name = req.body.name; //가맹점이름
  var enterpriseCode = req.body.enterpriseCode; //가맹점코드

  console.log(name);
  console.log(enterpriseCode);

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = 'T991605690U' + countnum;
  connection.query('SELECT * FROM fintech WHERE companyId = ?', [enterpriseCode], function(
    error,
    results,
    fields
  ) {
    console.log(results);
    if (error) throw error;
    var option = {
      method: 'post',
      url: 'https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num',
      headers: {
        Authorization: 'Bearer ' + results[0].accessToken
      },
      json: {
        bank_tran_id: transId,
        cntr_account_type: 'N',
        cntr_account_num: '2167113155',
        dps_print_content: '음식값',
        fintech_use_num: finusenum,
        wd_print_content: '음식값',
        tran_amt: '1000',
        tran_dtime: '20200910101921',
        req_client_name: '김다인', // 출금하라고 요청하는 사람 / 사실 내가 받음
        req_client_bank_code: '097',
        req_client_account_num: '1101230000678',
        req_client_num: 'HONGGILDONG1234',
        transfer_purpose: 'TR',
        // "sub_frnc_name" : "하위가맹점",
        // "sub_frnc_num" : "123456789012",
        // "sub_frnc_business_num" : "1234567890",
        recv_client_name: '김오픈', // 출금하라는 요청을 받았다 / 출금을 하는 주체는 회사
        recv_client_bank_code: '097',
        recv_client_account_num: '232000067812'
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
  var userData = req.decoded;
  var finusenum = req.body.fin_use_num;
  var sql = 'SELECT * FROM user WHERE id = ?';
  connection.query(sql, [userData.userId], function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(result);
      var random = Math.floor(Math.random() * 1000000000) + 1;
      var ranId = 'T991605830U' + random;
      var options = {
        method: 'POST',
        url: 'https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num',
        headers: {
          Authorization: 'Bearer ' + result[1].accesstoken,
          'Content-Type': 'application/json; charset=UTF-8'
        },
        json: {
          cntr_account_type: 'N',
          cntr_account_num: '0460562799',
          wd_pass_phrase: 'NONE',
          wd_print_content: '이용료(홍길동)',
          name_check_option: 'on',
          tran_dtime: '20200110102959',
          req_cnt: '1',
          req_list: [
            {
              tran_no: '1',
              bank_tran_id: ranId,
              fintech_use_num: '199160583057881543899606',
              print_content: '오픈서비스캐시백',
              tran_amt: '500',
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

module.exports = router;
