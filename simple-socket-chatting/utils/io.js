//  웹소켓 세팅, 통신 관련 함수

//userContorller 생성
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
            // 콜백함수로 실행결과를 응답, user 전달
            cb({ok: true, data: user});
         } catch(error) {
            // 실패하면 콜백함수를 다시 부른다
            cb({ok: false, error: error.message});
         }
      });

      //연결이 끊겼다면
      socket.on("disconnect", () => {
         console.log("disconnected");
      });
   });
};