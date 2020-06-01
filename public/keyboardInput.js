import {Message, MessageTypes} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class KeyBoardInput extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.keydownStatus, this.keydownStatus.bind(this)),

    ]

    constructor() {
        super()

        this.typeEvent = 'keydown'

        this.status = false;

        this.handle = this.handleKeydown.bind(this)

        this.addNotifications()

    }

    handleKeydown(event) {

        const keyPressed = event.key

        this.notifyAll(new Message(MessageTypes.keydown, keyPressed))


    }

    keydownStatus(message) {
        const status = message.content.status

        if (status === this.status)
            return

        this.status = status

        if (status)
            document.addEventListener(this.typeEvent, this.handle, false)
        else if (status === false) {
            document.removeEventListener(this.typeEvent, this.handle, false)
        }

    }


}