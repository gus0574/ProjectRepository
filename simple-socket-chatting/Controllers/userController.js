const User = require("../Models/user");

const userController = {};

//유저정보를 DB에 저장하는 saveUser함수를 정의. 저장하는 로직이기 때문에 promise를 반환하는 async 비동기 함수처리
//매개변수로 저장할 userName과 토큰(socket id)을 받음
//model기준 name은 io.js에서 프론트에서 소켓통신으로 받은 매개변수 token은 연결id(socket id)로 가져옴 
userController.saveUser = async(userName, socketid) => {
   //이미 존재하는 유저인지 확인, 
   let user = await User.findOne({ name: userName });
   //없으면 new user 생성
   if(!user) {
      user = new User({
         name: userName,
         token: socketid,
         online: true,
      });
   };
   //있으면 연결정보 token 값만 업데이트
   user.token = socketid;
   user.online = true;

   //await는 async 함수 내부에서 사용가능, 호출된 함수가 응답할 때까지 기다림
   //save 함수의 promise가 처리될 때 까지 기다리는 비동기 await 처리
   await user.save();
   return user;
};

// user 찾는 함수
userController.checkUser = async(socketid) => {
   const user = await User.findOne({token: socketid});
   if(!user) throw new Error("user not found");
   return user;
};

module.exports = userController;