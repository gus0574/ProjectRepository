import React, { useState } from 'react'
import { Input } from "@mui/base/Input";
import { Button } from "@mui/base/Button";
import './InputField.css'


const InputField = ({message,setMessage,sendMessage}) => {
  //enter 키로 전송 되도록 input 밖 form에서 핸들러 처리
  const handleEnter = (event) => {
    setMessage(event.target.value);
  }

  return (
    <div className="input-area">
          <div className="plus-button">+</div>
          <form onSubmit={sendMessage} className="input-container">
            <Input
              placeholder="Type in here…"
              value={message}
              onChange={handleEnter}
              multiline={false}
              rows={1}
            />

            <Button
              disabled={message === ""}
              type="submit"
              className="send-button"
            >
              전송
            </Button>
          </form>
        </div>
  )
}

export default InputField