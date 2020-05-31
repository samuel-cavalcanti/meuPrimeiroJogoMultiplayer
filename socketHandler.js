import Observable from "./public/observable.js";
import Observer from "./public/observer.js";
import {Message, MessageTypes} from "./public/message.js";

export default class SocketHandler {

    constructor() {


        this.observers = new Observer()
        this.observable = new Observable()

        this.socket = null


    }


    emit(message) {
        this.socket.emit(message.type, message)
    }

    addObservers() {
        this.observers.add(MessageTypes.setup, this.emit.bind(this))
        this.observers.add(MessageTypes.state, this.emit.bind(this))
    }


    socketSetup() {
        this.socket.on(MessageTypes.disconnect, this.disconnect.bind(this))
        // this.socket.on(MessageTypes.connect, this.connect.bind(this))
        this.socket.on(MessageTypes.move, this.move.bind(this))

    }

    disconnect() {
        console.log(`new Client is disconnect ${this.socket.id}`)

        this.observable.notifyAll(new Message(MessageTypes.removePlayer, {id: this.socket.id}))
    }

    move(message) {
        this.observable.notifyAll(new Message(MessageTypes.move, {command: message.content, id: this.socket.id}))
    }

    connect = function (socket) {
        console.log(`new Client is connected ${socket.id}`)
        this.socket = socket
        this.socketSetup()
        this.addObservers()
        this.observable.notifyAll(new Message(MessageTypes.addPlayer, {id: this.socket.id}))

    }

}