import express from 'express'
import http from 'http'
import {v4 as uuidv4} from 'uuid'
import Game from "./game.js";
import socketio from 'socket.io'
import {Message, MessageTypes} from "./public/message.js";


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

    function observer(message) {
        socket.emit(message.type, message)
    }

    const playerID = uuidv4()

    console.log(`new Client is connected ${socket.id}`)

    game.addPlayer(playerID, observer)

    socket.emit(MessageTypes.setup, new Message(MessageTypes.setup, {
        ids: {
            player: playerID,
            server: socket.id
        },
        state: game.getState()
    }))



    socket.on(MessageTypes.disconnect, () => {

        console.log(`Player is disconnected ${playerID}`)

        game.removePlayer(playerID)
    })

    socket.on(MessageTypes.move, (message) => {

        console.log(`Moving player ${playerID} ${message.content}`)

        game.movePlayer(playerID, message.content)
    })



})
