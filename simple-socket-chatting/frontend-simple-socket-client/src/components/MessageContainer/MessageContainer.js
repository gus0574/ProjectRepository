import React, { useState } from "react";
import "./MessageContainer.css";
import { Container } from "@mui/system";

// 메시지리스트와 유저정보를 받아서 채팅창에 메시지를 출력하는 컨테이너
const MessageContainer = ({ messageList, user }) => {
  return (
    <div>
      {messageList.map((message, index) => {
        return (
          <Container key={message._id} className="message-container">
            {message.user.name === "system" ? ( //시스템 메시지 가운데 출력
              <div className="system-message-container">
                <p className="system-message">{message.chat}</p>
              </div>
            ) : message.user.name === user.name ? ( //나의 메시지 오른쪽 출력
              <div className="my-message-container">
                <div className="my-message">{message.chat}</div>
              </div>
            ) : ( //상대 메시지 왼쪽 출력
              <div className="your-message-container">
                <img
                  src="/profile.jpeg"
                  className="profile-image"
                  style={
                    (index === 0
                      ? { visibility: "visible" }
                      : messageList[index - 1].user.name === user.name) ||
                    messageList[index - 1].user.name === "system"
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                />
                <div className="your-message">{message.chat}</div>
              </div>
            )}
          </Container>
        );
      })}
    </div>
  );
};

export default MessageContainer;
