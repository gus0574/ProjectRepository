import { useEffect, useState } from "react";
import "./App.css";
//server.js 에서 생성한 socket 가져오기
import socket from "./server"
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";

function App() {
  //백엔드 응답 데이터를 담을 user 스테이트 생성
  const [user, setUser] = useState();
  // message를 담을 스테이트 생성
  const [message, setMessage] = useState('');
  // message를 db에 저장하는 스테이트 생성
  const [messageList, setMessageList] = useState([]);
  //useEffect로 렌더링 될때마다 특정 작업을 실행하도록 함수 호출
  useEffect(() => {
    //message 이름으로 온 통신이 있으면
    socket.on('message', (message) => {
      // message List 를 저장, concat으로 메시지 뒤에 덧붙임 effect 안에 있으니 반복실행됨
      setMessageList((prevState) => prevState.concat(message));
    });
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

  // 메시지 전달 함수, 프론트의 onSubmit 호출시 생성. 
  // onSubmit는 호출마다 새로고침 되므로 이를 막아주는 preventDefault 처리 필요
  const sendMessage = (event) => {
    event.preventDefault();
    //socket send
    socket.emit("sendMessage", message, (res) => {
      console.log("sendMessage res : ", res)
    });
    // 전송 시 채팅바 지워지도록 설정
    setMessage('');
  };
  return (
    <div>
      <div className="App">
        {/* 채팅창에 메시지 출력 컴포넌트 생성 */}
        <MessageContainer messageList={messageList} user={user} />
        {/* 프론트 InputField.jsx의 메시지입력창 호출-렌더링, 메시지 매개변수 전달 */}
        <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>       
    </div>
  )
}

export default App;
