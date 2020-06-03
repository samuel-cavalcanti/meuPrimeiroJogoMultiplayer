import {Message, MessageTypes} from "./module/message.js";
import ModuleNotification from "./module/notification.js";
import Module from "./module/module.js";


export default class InputNick extends Module {


    notifications = [new ModuleNotification(MessageTypes.gameCommands.changeNick, this.changeNick.bind(this))]

    constructor(htmlInput) {
        super()
        this.htmlInput = htmlInput

        this.htmlInput.addEventListener('input', this.onInput.bind(this))
        this.htmlInput.addEventListener('change', this.onChange.bind(this))
        this.htmlInput.addEventListener('click', this.onClick.bind(this))

        this.addNotifications()

    }

    onInput(event) {
        this.notifyAll(new Message(MessageTypes.gameCommands.changeNick, {nick: this.htmlInput.value}))
    }

    onChange(event) {
        this.htmlInput.value = ''
        this.notifyAll(new Message(MessageTypes.keyboard.keydownStatus, {status: true}))

    }

    onClick(event) {
        console.log("input on click")
        this.notifyAll(new Message(MessageTypes.keyboard.keydownStatus, {status: false}))
    }

    changeNick(message) {
        this.htmlInput.placeholder = message.content.nick

    }


}