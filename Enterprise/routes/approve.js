var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
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


router.post('/emplist', function(req, res){
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



router.post('/approve', function(req, res){
    var isapprove = 


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
