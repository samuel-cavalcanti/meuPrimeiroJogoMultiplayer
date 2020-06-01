import {Message, MessageTypes} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class GameClient extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.state, this.getState.bind(this)),
        new ModuleNotification(MessageTypes.connect, this.connect.bind(this)),
        new ModuleNotification(MessageTypes.keydown, this.getKey.bind(this)),
        new ModuleNotification(MessageTypes.disconnect, this.disconnect.bind(this)),
        new ModuleNotification(MessageTypes.changeNick, this.changeNick.bind(this)),
    ]

    constructor() {
        super()

        this.moves = {
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        }

        this.nick = null

        this.ids = {
            player: null,
        }

        this.addNotifications()
    }


    connect(message) {

        this.ids.player = message.content.id
        const nick = this.nick ? this.nick : this.ids.player
        const content = {status: true}

        this.notifyAll(new Message(MessageTypes.setRenderStatus, content))
        this.notifyAll(new Message(MessageTypes.keydownStatus, content))

        this.notifyAll(new Message(MessageTypes.changeNick, {nick: nick}))
    }

    changeNick(message) {
        this.nick = message.content.nick

        this.notifyAll(new Message(MessageTypes.changeNick, {nick: this.nick}))
    }

    getState(message) {
        let state = message.content

        if (!this.ids.player)
            throw (`error playerID must exits id:${this.ids.player}`)
        else
            state.players[this.ids.player].color = 'yellow'


        this.notifyAll(new Message(MessageTypes.state, state))

    }

    getKey(message) {
        let key = message.content
        if (this.moves[key] !== undefined)
            this.notifyAll(new Message(MessageTypes.move, this.moves[key]))
    }

    disconnect(message) {

        this.notifyAll(new Message(MessageTypes.setRenderStatus, {status: false}))
    }


}