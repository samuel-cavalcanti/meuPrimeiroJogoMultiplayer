export default class Observable {

    constructor() {
        this.subscribers = {}
    }

    addSubscribe(id, observer) {
        if (this.subscribers[id] === undefined)
            this.subscribers[id] = observer
        else
            console.log(`exist observer id:${id}`);
    }

    removeSubscribe(id) {
        if (this.subscribers[id] !== undefined)
            delete this.subscribers[id]
        else
            console.warn(`Observer not exist ${id} `)
    }

    removeAllSubscribes() {
        this.subscribers = {}
    }

    notifyAll(message) {

        for (const observer of Object.values(this.subscribers))
            observer(message)
    }

    notify = function (id, message) {
        if (this.observers[id])
            this.observers[id](message)
        else
            console.warn(`Observer ${id} not fount`)
    }


}