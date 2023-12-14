//서버 관련

import {io} from "socket.io-client"

//socket 생성, 연결하고싶은 백엔드 주소
const socket = io("http://localhost:5001")

export default socket;