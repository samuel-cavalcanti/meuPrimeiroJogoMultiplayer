import {Message, MessageTypes} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class ClientNetworking extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.gameCommands.move, this.emit.bind(this)),
        new ModuleNotification(MessageTypes.gameCommands.changeNick, this.emit.bind(this))

    ]

    constructor() {
        super()

        this.socket = io()

        this.createListeners()

        this.addNotifications()

    }

    createListeners() {
        this.socket.on(MessageTypes.network.connect, this.connect.bind(this))
        this.socket.on(MessageTypes.network.disconnect, this.nullMessage(MessageTypes.network.disconnect))
        // this.socket.on(MessageTypes.setup, this.notifyAll.bind(this))
        this.socket.on(MessageTypes.gameCommands.state, this.notifyAll.bind(this))
        this.socket.on(MessageTypes.gameCommands.move, this.notifyAll.bind(this))
    }

    emit(message) {
        this.socket.emit(message.type, message)
    }


    connect() {
        console.log(` client connect`)
        this.notifyAll(new Message(MessageTypes.network.connect, {id: this.socket.id}))


    }

    nullMessage(type) {

        function message() {
            const message = new Message(type, {})
            this.notifyAll(message)
        }

        return message.bind(this)
    }


}