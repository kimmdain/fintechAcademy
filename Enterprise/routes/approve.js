var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var tokenKey = "fintechAcademy0$1#0@6!";
var auth = require('../lib/auth');

var mysql = require('mysql');
var config = require('../../config/config.json');

var connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password, // 본인 비번 쓰기!
  database: config.database
});

connection.connect;


router.get('/enterApprove', function(req, res){
    res.render('enterApprove');
})

router.post('/enterEmplist', auth, function(req, res){

    var enterData = req.decoded;
    console.log(enterData);
    var sql ="SELECT * FROM employee WHERE enterpriseCode = ?"

    connection.query(sql, [enterData.userCode], function (error, results, fields) {
        if (error) {
            console.error(err);
            throw error;
        }else {
            console.log('The result is: ', results);
            console.log('sql is ', this.sql);
            res.json(results);
        }
    }) 
})


router.post('/enterApprove', auth, function(req, res){

    var enterData = req.decoded;
    var id = req.body.ID;

    var sql ="UPDATE employee SET approved = 1 where id = ? "
    
    connection.query(sql, [id], function (error, results, fields) {
        if (error) {
            console.error(error);
            throw error;
        }else {
            console.log('sql is ', this.sql);
            res.json(results);
        }
    });
})

module.exports = router;