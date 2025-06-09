const SocketIO = require("socket.io");
axios = require("axios");

/* 
  ToiletId: {type: Number, require:true}, 
  Temperature: { type: Number, require: true}, 
  Humidity:{type: Number, require: true},
  State:{type: Boolean, require: true}, 
*/

module.exports = (server) => {
    const io = SocketIO(server, { 
        path: "/socket.io",
        cors:{                              //socket 사용시에 CORS 허용 설정
            origin: "http://localhost:5173",
            method:["GET","PUT","POST","DELETE"],
            credentials:true
        }
    });

    io.on("connection", (socket) => {       //io.sockets.on과 동일
        const req = socket.request;
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        console.log(
            `New Client : ${ip}, socket.id : ${socket.id}`
        );

        // 소켓 통신을 위한 소켓을 전역적으로 쓸 수 있도록 정의
        global.$socket = socket;

        socket.on('Updata', function (data){
            // 클라이언트가 전송한 데이터를 출력합니다.
            setInterval( axios.get(`http://localhost:3000/get_toilet_info/`)
            .then(contacts => {
                const data = contacts.data;
                socket.emit('ToiletData', data);
            })
            .catch(err => { 
                console.error('에러:', err);
                socket.emit('Alert', '서버 오류 발생');
            }),5000);
            

        socket.on("disconnect", () => {
            console.log(`Client Out : ${ip}, socket.id : ${socket.id}`);
        });

        socket.on("error", (error) => { });

        socket.on("from client", (data) => { // 클라이언트가 넘긴 데이터
            console.log(data);
        });
    });


  })
};