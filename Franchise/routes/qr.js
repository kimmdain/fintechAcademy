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

router.get('/franQrReader', function(req, res){
    res.render('franQrReader');
  })


// 출금이체 API
router.post('/withdrawQr',auth, function(req, res){
    var finusenum = req.body.qrFin;
    var userId = req.decoded.userId
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991599190U" + countnum; // id 변경해야함
    connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        if (error) throw error;
        var option = {
            method : "post",
            url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            json : {
                "bank_tran_id" : transId,
                "cntr_account_type" : "N",
                "cntr_account_num" : "2167113155",
                "dps_print_content" : "쇼핑몰환불",
                "fintech_use_num" : "199160569057881529757394",
                "wd_print_content" : "오픈뱅킹출금",
                "tran_amt" : "1000",
                "tran_dtime" : "20200910101921",
                "req_client_name": "김다인",
                "req_client_bank_code": "097",
                "req_client_account_num": "1101230000678",
                "req_client_num": "HONGGILDONG1234",
                "transfer_purpose" : "TR",
                "sub_frnc_name" : "하위가맹점",
                "sub_frnc_num" : "123456789012",
                "sub_frnc_business_num" : "1234567890",
                "recv_client_name" : "김오픈",
                "recv_client_bank_code" : "097",
                "recv_client_account_num" : "232000067812"
            }
        }
        request(option, function (error, response, body) {
            console.log(body);
            var resultObject = body;
            if(resultObject.rsp_code == "A0000"){
                res.json(1);
            } 
            else {
                res.json(resultObject.rsp_code)
            }

        });
    });
}) 