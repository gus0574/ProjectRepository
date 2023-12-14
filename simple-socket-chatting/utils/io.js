//  웹소켓 세팅, 통신 관련 함수

// io관련 모든 행위
module.exports=function(io) {
   //말하는 함수 emit
   
   //연결을 기다리는, 듣는 함수 .on()
   io.on("connection", async(socket)=>{
      console.log("cennected", socket.id)
   })
};