import Observable from "./observable.js";
import {Message, MessageTypes} from "./message.js";
import Observer from "./observer.js";

export default class GameClient {

    constructor(id) {

        this.moves = {
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        }

        this.ids = {
            player: null,
            client: id
        }

        this.observable = new Observable()

        this.observers = new Observer()

        this.addObservers()
    }


    addObservers() {

        this.observers.add(MessageTypes.state, this.getState.bind(this))
        this.observers.add(MessageTypes.connect, this.connect.bind(this))
        this.observers.add(MessageTypes.keydown, this.getKey.bind(this))
        this.observers.add(MessageTypes.disconnect, this.disconnect.bind(this))

    }

    connect(message) {
        this.ids.player = message.content.id

        this.observable.notifyAll(new Message(MessageTypes.setRenderStatus, {status: true}))
    }

    getState(message) {
        let state = message.content

        if (!this.ids.player)
            throw (`error playerID must exits id:${this.ids.player}`)
        else
            state.players[this.ids.player].color = 'yellow'

        const objects = Object.values(state.players).concat(Object.values(state.fruits))

        this.observable.notifyAll(new Message(MessageTypes.setObjects, objects))

    }

    getKey(message) {
        let key = message.content
        if (this.moves[key] !== undefined)
            this.observable.notifyAll(new Message(MessageTypes.move, this.moves[key]))
    }

    disconnect(message) {

        console.log(message)
        this.observable.notifyAll(new Message(MessageTypes.setRenderStatus, {status: false}))
    }


}