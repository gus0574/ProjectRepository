const messageController = {};
// message model 가져오기
const Chat = require("../Models/chat");

//message 저장 함수 정의. 유저 정보는 socket에서 가져온다
messageController.saveMessage = async(message, user) => {
   const newMessage = new Chat({
      chat: message,
      user: {
         // _id 는 mongoDB 시퀀스 포맷?
         id: user._id,
         name: user.name,
      },
   });

   await newMessage.save();
   return newMessage;
};

module.exports = messageController;