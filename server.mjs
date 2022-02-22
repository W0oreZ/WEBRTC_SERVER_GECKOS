import geckos from "@geckos.io/server";
import http from 'http';
import udp from "dgram";
import express from "express";

const app = express();
const server = http.createServer(app)
const UDPserver = udp.createSocket("udp4");
const io = geckos({
  portRange: {
    min: 20000,
    max: 20100
  },
  iceServers: [
    { urls: "stun:stun01.sipphone.com" },
    { urls: "stun:stun.ekiga.net" },
    { urls: "stun:stun.fwdnet.net" },
    { urls: "stun:stun.ideasip.com" },
    { urls: "stun:stun.iptel.org" },
    { urls: "stun:stun.rixtelecom.se" },
    { urls: "stun:stun.schlund.de" },
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stunserver.org" },
    { urls: "stun:stun.softjoys.com" },
    { urls: "stun:stun.voiparound.com" },
    { urls: "stun:stun.voipbuster.com" },
    { urls: "stun:stun.voipstunt.com" },
    { urls: "stun:stun.voxgratia.org" },
    { urls: "stun:stun.xten.com" },
    {
      urls: "turn:turn1.nextronic.ddns.me:3478",
      credential: "6482",
      username: "user2",
    },
  ],
});
io.addServer(server)

//============================ UDP SERVER ========================

UDPserver.on('listening',function(){
    const address = UDPserver.address();
    const port = address.port;
    const family = address.family;
    const ipaddr = address.address;
    console.log('UDP Server is listening at port' + port);
    console.log('UDP Server ip :' + ipaddr);
    console.log('UDP Server is IP4/IP6 : ' + family);
});

UDPserver.on('error',function(error){
    console.log('Error: ' + error);
});

UDPserver.on('message',function(msg, info){
    console.log('UDP SERVER Received %d bytes from %s:%d\n\n',msg.length, info.address, info.port);
    if(io) {
        io.emit('stream', msg.toString());
    }
});

UDPserver.on('close',function(){
    console.log('UDP Server Stopped !');
});

//============================ UDP SERVER ========================



//============================ Geckio SERVER =====================

io.onConnection((channel) => {
    const { id } = channel;
    console.log("IO New Client Connected : "+ id + "\n\n");

    channel.onDisconnect(() => {
      console.log(`${channel.id} got disconnected`)
    })

    channel.emit('events', `USER: ${channel.id} | Connected.`);

    channel.on("data", (data) => {
        console.log("IO Server Received : ", data);
    });
});

//============================ Geckio SERVER =====================


//============================ EXPRESS SERVER ====================

app.use(express.json());
app.use(express.static('public'));

//============================ EXPRESS SERVER ====================


// app.listen(3000,"0.0.0.0", null, () => {
//     console.log('HTTP Server is running at http://localhost:3000');
// });

server.listen(9208, "0.0.0.0", null, () => {
  console.log('HTTP/Geckos Server is running at :9208');
})

//io.listen(3030);

UDPserver.bind(2222);

