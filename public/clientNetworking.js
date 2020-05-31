import Observable from "./observable.js";
import {Message, MessageTypes} from "./message.js";
import Observer from "./observer.js";

export default class ClientNetworking {

    constructor(id) {

        this.socket = io()
        this.observable = new Observable()
        this.id = id

        this.observers = new Observer()
        this.addObservers()
        this.createListeners()
    }


    createListeners() {
        this.socket.on(MessageTypes.connect, this.connect.bind(this))
        this.socket.on(MessageTypes.disconnect, this.nullMessage(MessageTypes.disconnect))

        this.socket.on(MessageTypes.setup, this.observable.notifyAll.bind(this.observable))
        this.socket.on(MessageTypes.state, this.observable.notifyAll.bind(this.observable))
        this.socket.on(MessageTypes.move, this.observable.notifyAll.bind(this.observable))
    }

    emit(message) {
        this.socket.emit(message.type, message)
    }

    addObservers() {
        this.observers.add(MessageTypes.move, this.emit.bind(this))
    }

    connect() {
        this.observable.notifyAll(new Message(MessageTypes.connect, {id: this.socket.id}))
    }

    nullMessage(type) {

        function message() {
            const message = new Message(type, {})
            this.observable.notifyAll(message)
        }

        return message.bind(this)
    }


}