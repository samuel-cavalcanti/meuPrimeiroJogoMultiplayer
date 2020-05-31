import Subject from "./subject.js";
import {Message, MessageTypes} from "./message.js";

export default class KeyBoardInput {

    constructor() {
        document.addEventListener('keydown', this.handleKeydown.bind(this))
        this.subject = new Subject()
    }

    handleKeydown = function (event) {

        const keyPressed = event.key

        this.subject.notifyAll(new Message(MessageTypes.keydown, keyPressed))
    }


}