import {Message, MessageTypes} from "./public/module/message.js";
import Module from "./public/module/module.js";
import ModuleNotification from "./public/module/notification.js";
import {v4 as uuidV4} from 'uuid'

export default class SocketHandler extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.state, this.emit.bind(this))
    ]

    constructor() {
        super()
        this.socket = null
        this.__ID = uuidV4()

        this.addNotifications()
    }


    emit(message) {
        this.socket.emit(message.type, message)
    }


    socketSetup() {
        this.socket.on(MessageTypes.disconnect, this.disconnect.bind(this))
        // this.socket.on(MessageTypes.connect, this.connect.bind(this))
        this.socket.on(MessageTypes.move, this.move.bind(this))
        this.socket.on(MessageTypes.changeNick, this.changeNick.bind(this))

    }

    disconnect() {
        console.log(`new Client is disconnect ${this.socket.id}`)

        this.notifyAll(new Message(MessageTypes.removePlayer, {socketModule: this}))

        this.subscribers.removeAllSubscribes()

    }

    move(message) {
        this.notifyAll(new Message(MessageTypes.move, {command: message.content, id: this.socket.id}))
    }

    changeNick(message) {
        const nick = message.content.nick

        this.notifyAll(new Message(MessageTypes.changeNick, {id: this.socket.id, nick: nick}))
    }

    connect(socket) {
        console.log(`new Client is connected ${socket.id}`)
        this.socket = socket
        this.socketSetup()
        this.notifyAll(new Message(MessageTypes.addPlayer, {id: this.socket.id}))

    }

}