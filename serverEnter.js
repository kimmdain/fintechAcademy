var request = require('request');
var express = require("express");
var jwt = require('jsonwebtoken');
var tokenKey = "fintechAcademy0$1#0@6!";
var auth = require('./lib/auth');
app = express();
var port = process.env.PORT || 3001;

// 다른 사용자들에게 보여줄 파일들이 있는 폴더. 공개용 폴더.
// 이게 없으면 보여주고 싶은 정보들(이미지, 코드)이 그 자체가 아니라 경로, 코드로 보여짐.
app.use(express.static(__dirname + '/public')); 

app.set('views', __dirname + '/viewEnter');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '359812wjd', // 본인 비번 쓰기!
  database : 'fintech'
});

connection.connect();


app.get('/enterSignup', function(req, res){
    res.render('enterSignup');
})

app.get('/enterLogin', function(req, res){
    res.render('enterLogin');
})

app.get('/main', function(req, res){
    res.render('main');
})


// -------------------- post ---------------------//

app.post('/Enteruser', function(req, res){
    console.log(req.body);
   // var entCode = req.body.entCode;
    var ID = req.body.ID;
    var PW = req.body.password;

    var sql = "INSERT INTO fintech.enterprise (ID, PW) VALUES (?, ?)";
    connection.query(sql, [ID, PW], function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        console.log('sql is ', this.sql);
        res.json(1);
    });
})

app.post('/enterLogin', function(req, res){
    var userID = req.body.ID;
    var userPassword = req.body.password;
    var sql = "SELECT * FROM fintech.enterprise WHERE ID = ?";
    connection.query(sql, [userID], function (error, results, fields) {
        if (error) throw error;
        console.log(results[0].PW, userPassword);
        if(results[0].PW == userPassword){     
            console.log(results);
            res.json(results)
            jwt.sign(
                {
                    userId : results[0].enterpriseID,
                    userPW : results[0].enterprisePW
                },
                tokenKey,
                {
                    expiresIn : '10d',
                    issuer : 'fintech.admin',
                    subject : 'user.login.info'
                },
                function(err, token){
                    console.log('로그인 성공', token)
                    res.json(token)
                }
            )

        }
        else{
            console.log('비밀번호 틀렸습니다.');
            res.json(0);
        }    
    });
})

app.post('/balance', auth, function(req, res){ // 계좌 잔액 조회
    var userData = req.decoded;
    var finusenum = req.body.fin_use_num;

    var sql ="SELECT * FROM user WHERE id = ?"
    connection.query(sql, [userData.userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            console.log(result);
            var random = Math.floor(Math.random() * 1000000000) + 1;    
            var ranId = "T991605830U" + random;
            var option = {
                method: 'GET',
                url: 'https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num',
                headers: {
                  'Authorization': 'Bearer ' + result[0].accesstoken
                 },
                qs : {
                    
                    bank_tran_id : ranId,
                    fintech_use_num : finusenum,
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


app.post('/balancelist', auth, function(req, res){   //거래내역조회 
    var userData = req.decoded;
    var finusenum = req.body.fin_use_num;

    var sql ="SELECT * FROM user WHERE id = ?"
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



app.listen(port);

console.log("Listening on port ", port);