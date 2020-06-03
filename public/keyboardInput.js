import {Message, MessageTypes} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class KeyBoardInput extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.keyboard.keydownStatus, this.keydownStatus.bind(this)),

    ]
    events = [MessageTypes.keyboard.keyup, MessageTypes.keyboard.keydown]
    handles = {}

    constructor() {
        super()


        this.status = false;


        this.addNotifications()

        this.addHandles()

    }

    addHandles() {
        this.handles[MessageTypes.keyboard.keydown] = this.handleKeydown.bind(this)
        this.handles[MessageTypes.keyboard.keyup] = this.handleKeyUp.bind(this)
    }

    handleKeydown(event) {

        const keyPressed = event.key

        this.notifyAll(new Message(MessageTypes.keyboard.keydown, keyPressed))
    }

    handleKeyUp(event) {
        const keyUp = event.key

        this.notifyAll(new Message(MessageTypes.keyboard.keyup, keyUp))
    }

    keydownStatus(message) {
        const status = message.content.status

        if (status === this.status)
            return

        this.status = status

        if (status)
            this.enableEvents()
        else if (status === false) {
            this.disableEvents()
        }

    }

    enableEvents() {
        for (let event of this.events) {
            document.addEventListener(event, this.handles[event], false)
            // this.notifyAll(new Message(MessageTypes.audio.playAudio, {audio: MessageTypes.audio.solveThePuzzle, volume: 0.6}))
        }
    }

    disableEvents() {
        for (let event of this.events) {
            document.removeEventListener(event, this.handles[event], false)
        }

    }

}