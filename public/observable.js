export default class Observable {

    constructor() {
        this.observers = {}
    }

    subscribe = function (id, observer) {
        if (this.observers[id] === undefined)
            this.observers[id] = observer
        else
            throw (`Error observer exist ${this.observers[id]}`)
    }

    unsubscribe = function (id) {
        if (this.observers[id] !== undefined)
            delete this.observers[id]
        else
            console.warn(`Observer not exist ${id} `)
    }

    notifyAll = function (message) {

        for (const observer of Object.values(this.observers))
            observer(message)
    }

    notify = function (id, message) {
        if (this.observers[id])
            this.observers[id](message)
        else
            console.warn(`Observer ${id} not fount`)
    }


}