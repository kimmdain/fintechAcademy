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



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
