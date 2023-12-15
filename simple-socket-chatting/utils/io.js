//  웹소켓 세팅, 통신 관련 함수

//userContorller 생성
const messageController = require("../Controllers/messageController");
const userController = require("../Controllers/userController");

// io관련 모든 행위
module.exports = function(io) {
   //말하는 함수 emit
   
   //연결을 기다리는, 듣는 함수 .on()
   io.on("connection", async(socket)=>{
      console.log("cennected", socket.id)

      //front에서 emit로 보낸 login이라는 통신을 on으로 받고, 파라미터 userName과 콜백함수 cb를 async처리 후 작업정의
      socket.on("login", async(userName, cb) => {
         try{
            // user.js model 기준 사용자 정보를 저장. controller에서 user 정보를 가져올 때 까지 await
            const user = await userController.saveUser(userName, socket.id);
            // 사용자 로그인/로그아웃 시 system message 생성
            const welcomeMessage = {
               message: `${user.name} is joined to this room.`,
               user: { id: null, name: "system"},
            };
            io.emit("message", welcomeMessage);
            // 콜백함수로 실행결과를 응답, user 전달
            cb({ok: true, data: user});
         } catch(error) {
            // 실패하면 콜백함수를 다시 부른다
            cb({ok: false, error: error.message});
         }
      });

      //front 단의 App.js에서 보내는 sendMessage를 수신하고, async message와 cb를 받아 함수 정의
      socket.on("sendMessage", async(message, cb) => {
         try{
            // 메시지 사용자 정보가 필요하므로 socket id 로 유저 찾기 - userController
            const user = await userController.checkUser(socket.id);
            // message save 저장 (유저) - message controller 필요
            const newMessage = await messageController.saveMessage(message, user);
            // 다른 클라이언트도 메시지를 볼 수 있도록 처리 -> 프론트에서 수신처리 필요
            io.emit("message", newMessage);
            // 성공상태 콜백
            cb({ok: true});
         } catch(error) {
            cb({ok: false, error: error.message});
         }     
      });

      //연결이 끊겼다면
      socket.on("disconnect", () => {
         console.log("disconnected");
      });
   });
};