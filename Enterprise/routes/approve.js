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


router.post('/emplist', function(req, res){ // 직원 목록 불러오기 
    var enterData = req.decoded;
    var sql ="SELECT name, rank, balance, ID, approved FROM employee WHERE ID = ? and enterprise.enterpriseCode=employee.enterpriseCode"
    connection.query(sql, [enterData.enterpriseID], function (error, result) {
        if (error) {
            console.error(err);
            throw error;
        }
        else {
            console.log('The result is: ', result);
            console.log('sql is ', this.sql);
            res.json(result);
        }
       
    });


})



router.post('/approve', function(req, res){ // 직원 승인

    var Data = req.decoded;
    var sql ="UPDATE employee SET approved=1 WHERE ID = ?";

    connection.query(sql, [Data.ID], function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        console.log('sql is ', this.sql);
        res.json(1);
       
    });


})
