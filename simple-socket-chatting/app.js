// @@@@@ 1차 기본 틀 @@@@@ 
//express server 생성
const express = require("express");
//DB 연결 도와주는 mongoose 생성
const mongoose = require("mongoose");
//process.env 사용을 위해 dotenv api 사용
require('dotenv').config();
//동일 origin 허용 cors 라이브러리 설정
const cors = require("cors");
//express 서버 기반 app 생성
const app = express();
//app에서 cors를 사용하도록
app.use(cors());

//mongoose로 DB 연결, .then 연결이 됐다면 로그 생성
//.env 환경변수 file에서 db접속정보 가져옴
mongoose.connect(process.env.DB, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(
   ()=>console.log("connected to db")
);

module.exports = app;
// @@@@@ 1차 기본 틀 @@@@@  nodemon으로 실행, npm install nodemon / nodemon app.js