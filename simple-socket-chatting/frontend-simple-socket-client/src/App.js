import { useEffect, useState } from "react";
import "./App.css";
//server.js 에서 생성한 socket 가져오기
import socket from "./server"

function App() {
  const [user, setUser] = useState();
  //useEffect로 렌더링 될때마다 특정 작업을 실행하도록 함수 호출
  useEffect(() => {
    askUserName();
  }, []);

  //함수 생성, 
  const askUserName = () => {
    //프롬프트를 통해 웹 뷰에서 사용자의 userName을 받음
    const userName = prompt("Insert your Name");
    console.log("username : ", userName);

    //socket의 emit(제목, 보낼 내용, 콜백함수) 함수를 사용하여 userName을 백엔드로 전송, 백엔드 io.js의 응답을 res로 받음
    socket.emit("login", userName, (res) => {
      // 콜백에서 넘어온 ok가 트루라면 유저정보 res.data를 DB에 저장
      if(res?.ok) {
        setUser(res.data);
      }
    });
  };

  return (
    <div>
      <div className="App"></div>
    </div>
  );
}

export default App;
