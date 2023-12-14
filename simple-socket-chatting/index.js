//서버설정

// http 서버 생성기
const {createServer} = require("http");
//만들어놓은 app.js 가져오기
const app = require("./app");
//webSocket을 socket.io 라이브러리에서 가져오기
const {Server} = require("socket.io");
require("dotenv").config();

// httpServer 생성 , app를 서버에 올린다
const httpServer = createServer(app);
//WebSocket서버 위에 httpServer을 올리고, cors 설정
const io = new Server(httpServer, {
   cors:{
      //frontend 주소
      origin: "http://localhost:3000"
   }
});

//특정 포트를 기준으로 서버 실행 
httpServer.listen(process.env.PORT, 
   () => console.log("server listening on port : ", process.env.PORT));
