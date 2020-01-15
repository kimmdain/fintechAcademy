var express = require('express');
var router = express.Router();
var auth = require('./lib/auth');

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

router.post('/transaction', auth, function(req, res){   //회사 거래내역조회 -sql고쳐야함
    var userData = req.decoded;
    var finusenum = req.body.fin_use_num;

    var sql ="SELECT * FROM enterprise WHERE id = ?"
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
