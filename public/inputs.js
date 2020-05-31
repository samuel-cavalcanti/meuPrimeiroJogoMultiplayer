import Observable from "./observable.js";
import {Message, MessageTypes} from "./message.js";

export default class KeyBoardInput {

    constructor() {
        document.addEventListener('keydown', this.handleKeydown.bind(this))
        this.observable = new Observable()

    }

    handleKeydown(event) {

        const keyPressed = event.key

        this.observable.notifyAll(new Message(MessageTypes.keydown, keyPressed))
    }


}