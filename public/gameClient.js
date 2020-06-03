import {Message, MessageTypes} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class GameClient extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.gameCommands.state, this.getState.bind(this)),
        new ModuleNotification(MessageTypes.network.connect, this.connect.bind(this)),
        new ModuleNotification(MessageTypes.keyboard.keydown, this.getKey.bind(this)),
        new ModuleNotification(MessageTypes.network.disconnect, this.disconnect.bind(this)),
        new ModuleNotification(MessageTypes.gameCommands.changeNick, this.changeNick.bind(this)),
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
        this.numberOfFruits = null

        this.ids = {
            player: null,
        }

        this.addNotifications()
    }


    connect(message) {

        this.ids.player = message.content.id
        const nick = this.nick ? this.nick : this.ids.player
        const content = {status: true}

        this.notifyAll(new Message(MessageTypes.render.setRenderStatus, content))
        this.notifyAll(new Message(MessageTypes.keyboard.keydownStatus, content))

        this.notifyAll(new Message(MessageTypes.gameCommands.changeNick, {nick: nick}))

    }

    changeNick(message) {
        this.nick = message.content.nick

        this.notifyAll(new Message(MessageTypes.gameCommands.changeNick, {nick: this.nick}))
    }

    getState(message) {

        let state = message.content

        this.changeUserPlayerColor(state.players)

        this.audioNotification(state)


        this.notifyAll(new Message(MessageTypes.gameCommands.state, state))

    }

    changeUserPlayerColor(players) {

        if (!this.ids.player)
            console.error(`error playerID must exits id:${this.ids.player}`)
        else
            players[this.ids.player].color = 'yellow'

    }

    getKey(message) {
        let key = message.content
        if (this.moves[key] !== undefined)
            this.notifyAll(new Message(MessageTypes.gameCommands.move, this.moves[key]))
    }

    disconnect(message) {
        this.numberOfFruits = null
        this.notifyAll(new Message(MessageTypes.render.setRenderStatus, {status: false}))
    }


    audioNotification(state) {

        const removeFruit = state.removeFruit
        const playAudio = state.playAudio

        if (removeFruit && removeFruit.id === this.ids.player)
            this.notifyAll(new Message(MessageTypes.audio.playAudio, {audio: MessageTypes.audio.collect, volume: 1}))

        if (playAudio) {
            this.notifyAll(new Message(MessageTypes.audio.playAudio, {audio: playAudio, volume: 0.5}))
        }
    }


}