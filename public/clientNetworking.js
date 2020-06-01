import {Message, MessageTypes} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class ClientNetworking extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.move, this.emit.bind(this)),
        new ModuleNotification(MessageTypes.changeNick, this.emit.bind(this))

    ]

    constructor() {
        super()

        this.socket = io()

        this.createListeners()

        this.addNotifications()

    }

    createListeners() {
        this.socket.on(MessageTypes.connect, this.connect.bind(this))
        this.socket.on(MessageTypes.disconnect, this.nullMessage(MessageTypes.disconnect))
        this.socket.on(MessageTypes.setup, this.notifyAll.bind(this))
        this.socket.on(MessageTypes.state, this.notifyAll.bind(this))
        this.socket.on(MessageTypes.move, this.notifyAll.bind(this))
    }

    emit(message) {
        this.socket.emit(message.type, message)
    }


    connect() {
        console.log(` client connect`)
        this.notifyAll(new Message(MessageTypes.connect, {id: this.socket.id}))


    }

    nullMessage(type) {

        function message() {
            const message = new Message(type, {})
            this.notifyAll(message)
        }

        return message.bind(this)
    }


}