var express = require('express');
var router = express.Router();

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

router.post('/code', auth, function(req, res){  //회사 코드 확인하는 API
    //console.log(req.body);
   // var entCode = req.body.entCode;
    var enterData = req.decoded;
    var sql ="SELECT enterpriseCode FROM enterprise WHERE id = ?"
    connection.query(sql, [enterData.enterpriseID], function (error, results, fields) {
        if (error) {
            console.error(err);
            throw error;
        }
        else {
            console.log('The result is: ', results);
            console.log('sql is ', this.sql);
            res.json(results);
        }
       
    });
})