import Subject from "./subject.js";
import {Message, MessageTypes} from "./message.js";

export default class GameClient {

    constructor(id) {

        this.moves = {
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        }

        this.ids = {
            server: null,
            screens: {},
            player: null,
            client: id
        }

        this.requestAnimationID = null

        this.subject = new Subject()

        this.observers = this.makeObservers()
    }


    observer = function (message) {
        if (this.observers[message.type])
            this.observers[message.type](message.content)
    }


    makeObservers() {
        let observers = {}

        observers[MessageTypes.state] = this.getState.bind(this)
        observers[MessageTypes.setup] = this.setup.bind(this)
        observers[MessageTypes.keydown] = this.getKey.bind(this)
        observers[MessageTypes.disconnect] = this.disconnect.bind(this)

        return observers

    }

    setup(content) {
        const ids = content.ids

        this.ids = Object.assign(this.ids, ids)

        this.getState(content.state)
    }

    getState(state) {

        if (!this.ids.player)
            throw (`error playerID must exits id:${this.ids.player}`)
        else
            state.players[this.ids.player].color = 'yellow'

        const objects = Object.values(state.players).concat(Object.values(state.fruits))

        this.subject.notifyAll(new Message(MessageTypes.setObjects, objects))
    }

    getKey(key) {
        console.log(`key press ${key}`)

        if (this.moves[key] !== undefined)
            this.subject.notifyAll(new Message(MessageTypes.move, this.moves[key]))
    }

    disconnect(message) {
        this.ids.server = null
        this.ids.player = null

        this.subject.unsubscribe(this.ids.server)

    }


}