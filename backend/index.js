
const express = require('express');
const cors = require('cors');
const http = require('http');
//const socketio = require('socket.io');

const app = express();      //express app 생성

app.use(express.json());  //json 형식 파싱하기
app.use(cors()); //cors 적용

const dbconfig = require("./db.js"); //db 저장 정보
const mongoose = require('mongoose');
//데이터베이스 연결 및 상태 로깅
mongoose.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true})
.then( () => {
    console.log("정상적으로 MongoDB 서버에 연결되었습니다.");
}).catch( err => {
    console.log("MongoDB에 연결되지 않았습니다.", err);
});

app.get('/', (req, res) => {
  console.log(req);
  res.json({"message": "NAGA."});
})

require('./router.js')(app); //이외 동작을 위한 라우터


const httpServer = http.createServer(app).listen(3000, () => { 
  console.log("포트 3000에 연결되었습니다."); 
});

require('./socket.js')(httpServer);
