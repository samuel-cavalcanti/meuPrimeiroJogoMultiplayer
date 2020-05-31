import subject from "./subject.js";
import {Message, MessageTypes} from "./message.js";


export default class Networking {

    constructor(id) {

        this.socket = io()
        // socket.on(MessageTypes.connect, this.connect.bind(this))
        this.createListeners()

        this.subject = new subject()
        this.id = id

        this.observers = this.createObservers()
    }


    createListeners() {
        this.socket.on(MessageTypes.state, this.state.bind(this))
        this.socket.on(MessageTypes.disconnect, this.disconnect.bind(this))
        this.socket.on(MessageTypes.move, this.move.bind(this))
        this.socket.on(MessageTypes.setup, this.setup.bind(this))
    }

    setup(message) {
        this.subject.notifyAll(message)
    }

    disconnect(message) {
        this.subject.notifyAll(message)
    }


    state(message) {
        console.log(message)
        this.subject.notifyAll(message)
    }

    move(message) {
        console.log(message)
        this.subject.notifyAll(message)
    }

    observer(message) {
        if (this.observers[message.type])
            this.observers[message.type](message)
    }

    emit(message) {
        this.socket.emit(message.type, message)
    }

    createObservers() {
        let observers = {}
        observers[MessageTypes.move] = this.emit.bind(this)

        return observers

    }
}