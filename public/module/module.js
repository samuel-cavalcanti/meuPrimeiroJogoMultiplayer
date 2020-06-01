import Observable from "./observable.js";
import Observer from "./observer.js";


export default class Module {
    notifications = []
    subscribers = new Observable()

    subscriptions = new Observer()

    __ID = this.uuidV4()

    constructor() {

    }

    addNotifications() {

        for (const notification of this.notifications) {
            this.addNotification(notification.messageType, notification.callback)
        }
    }

    uuidV4() {
        try {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        } catch (e) {
            return null
        }

    }

    addNotification(messageType, callback) {
        this.subscriptions.add(messageType, callback)
    }


    subscribe(_module) {
        _module.subscribers.addSubscribe(this.__ID, this.subscriptions.observe)

    }

    unsubscribe(_module) {
        _module.subscribers.removeSubscribe(this.__ID)
    }



    notifyAll(message) {
        this.subscribers.notifyAll(message)
    }


}