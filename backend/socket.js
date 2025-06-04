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

        socket.on('Check', function (data) {
            // 클라이언트가 전송한 데이터를 출력합니다.
            console.log('화장실코드:', data.ToiletId);
            console.log('온도:', data.Temperature);
            console.log('습도:', data.Humidity);
            console.log('사용여부부:', data.State);
            axios.post(`http://localhost:3000/check_toilet/${data.ToiletId}`)
            .then(contacts => {
                if (contacts.data.duplicated) {
                    socket.emit('Alert', '해당 화장실이 존재합니다.');
                } else {
                    socket.emit('Alert', '해당 화장실을 추가합니다.');
                    socket.emit('sign', data); // 신청 진행 프론트엔드쪽쪽
                }
            })
            .catch(err => { 
                console.error('에러:', err);
                socket.emit('Alert', '서버 오류 발생');
            })

        socket.on("disconnect", () => {
            console.log(`Client Out : ${ip}, socket.id : ${socket.id}`);
        });

        socket.on("error", (error) => { });

        socket.on("from client", (data) => { // 클라이언트가 넘긴 데이터
            console.log(data);
        });
    });

    socket.on('DeleteCheck', function (data) { 
        // 클라이언트가 전송한 데이터를 출력합니다.
        console.log('강의코드:', data);
        axios.delete(`http://localhost:3000/delete_toilet_info/${data}`)
        .then(contacts => {
            socket.emit('Alert', '해당 화장실을 삭제했습니다.');
        })
        .catch(err => { 
            socket.emit('Alert', '해당 화장실이이 존재하지 않습니다.');
        })

    socket.on("disconnect", () => {
        console.log(`Client Out : ${ip}, socket.id : ${socket.id}`);
    });

    socket.on("error", (error) => { });

    socket.on("from client", (data) => { // 클라이언트가 넘긴 데이터
        console.log(data);
    });
});

    socket.on('Creat', function (data) { 
    // 클라이언트가 전송한 데이터를 출력합니다.
    console.log('강의코드:', data.lectureId);
    axios.post(`http://localhost:3000/check_List/${data.ToiletId}`)
    .then(contacts => {
        if (contacts.data.duplicated) {
            socket.emit('Alert', '해당 화장실이 존재합니다.');
        } else {
            socket.emit('Alert', '해당 화장실을 추가합니다.');
            socket.emit('sign', data);
        }
    })
    .catch(err => { 
        console.error('에러:', err);
        socket.emit('Alert', '서버 오류 발생');
    })

socket.on("disconnect", () => {
    console.log(`Client Out : ${ip}, socket.id : ${socket.id}`);
});

socket.on("error", (error) => { });

socket.on("from client", (data) => { // 클라이언트가 넘긴 데이터
    console.log(data);
});
});


socket.on('Updata', function (data) { //강의코드를 DB에서 검색해서 해당강의 put 찾은후 소켓호출
    // 클라이언트가 전송한 데이터를 출력합니다.
    console.log('강의코드:', data.lectureId);
    axios.get(`http://localhost:3000/put_toilet_info/${data.lectureId}`)
    .then(contacts => {
        socket.emit('Alert', '해당 화장실을을 수정합니다.');
        socket.emit('Updata', data);
    })
    .catch(err => { 
        socket.emit('Alert', '해당 화장실이 존재하지 않습니다.');
    })

socket.on("disconnect", () => {
    console.log(`Client Out : ${ip}, socket.id : ${socket.id}`);
});

socket.on("error", (error) => { });

socket.on("from client", (data) => { // 클라이언트가 넘긴 데이터
    console.log(data);
});
});

socket.on('Delete', function (data) { //강의코드를 DB에서 검색해서 해당강의 put 찾은후 소켓호출
    // 클라이언트가 전송한 데이터를 출력합니다.
    console.log('강의코드:', data);
    axios.get(`http://localhost:3000/delete_toilet_info/${data}`)
    .then(contacts => {
        socket.emit('Alert', '해당 화장실을을 삭제합니다..');
        socket.emit('Delete', data);
    })
    .catch(err => { 
        socket.emit('Alert', '해당 화장실이 존재하지 않습니다.');
    })

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