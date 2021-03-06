export default class Observer {

    constructor() {
        this.observers = {}
        this.observe = this.observerMessage.bind(this)
    }


    add = function (id, observer) {
        this.observers[id] = observer
    }

    remove = function (id) {
        if (this.observers[id])
            delete this.observers[id]
        else
            console.warn(`Observer ${id} not exist`)
    }


    observerMessage(message) {
        if (this.observers[message.type])
            this.observers[message.type](message)
    }


}