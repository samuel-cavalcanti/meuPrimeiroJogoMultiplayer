import express from 'express';
import http from 'http';
import Game from "./game.js";
import socketio from 'socket.io';
import {MessageTypes} from "./public/message.js";
import SocketHandler from "./socketHandler.js";


const app = express()

const server = http.createServer(app)

const sockets = socketio(server)

app.use(express.static('public'))

server.listen(3000, () => {
    console.log(`server listening on port 3000`)
})


let game = new Game()

game.start()


sockets.on(MessageTypes.connection, (socket) => {
    let handle = new SocketHandler()

    game.observable.subscribe(socket.id, handle.observers.observe)
    handle.observable.subscribe('game', game.observers.observe)

    handle.connect(socket)

})
