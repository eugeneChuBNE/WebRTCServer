const fs = require('fs'),
      https = require('https'),
      // http = require('http'),
      PORT1 = 3001,
      PORT0 = 3000;

const sslOptions = {
    //generate a SSL certificate in the elf terminal.
    //openssl genrsa -out key.pem
    //openssl req -new -key key.pem -out csr.pem
    //openssl x509 -req -days 9099 -in csr.pem -signkey key.pem -out cert.pem
    //rm csr.pem
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

let express = require('express'),
    app = express(),
    cors = require('cors');
app.use(cors());

const httpsServer = https.createServer(sslOptions, app);
// const httpServer = http.Server(app);

const io = require('socket.io')(httpsServer, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('user connection on ' + PORT0 + ':' + socket.id);
    io.emit('userid', socket.id);
    io.to(socket.id).emit('ownid', socket.id);
    socket.on('message', (message) => {
        io.emit('message', message);
    })

    socket.on('peerID', (message) => {
        io.emit('peerID', message);
        console.log("peerID:" + message);
    })
})

httpsServer.listen(PORT0, () => {
    console.log(`Starting https server at: ${PORT0}`);
});

const {
    PeerServer
} = require('peer');

PeerServer({
    port: PORT1,
    path: '/',
    ssl: sslOptions
});

console.log(`Starting SSL PeerServer at: ${PORT1}`);

