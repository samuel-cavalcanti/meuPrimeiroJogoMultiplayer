import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";
import {MessageTypes} from "./module/message.js";

export default class ControlsImage extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.keyboard.keyup, this.keyUp.bind(this)),
        new ModuleNotification(MessageTypes.keyboard.keydown, this.keyDown.bind(this))
    ]

    constructor(htmlDivControls) {
        super();

        this.w = null
        this.s = null
        this.a = null
        this.d = null

        this.getImages(htmlDivControls.getElementsByTagName('img'))

        this.addNotifications()
    }


    getImages(htmlImages) {

        for (let htmlImage of htmlImages) {
            const split = htmlImage.id.split('.')
            this[split[0]] = htmlImage
        }
    }

    keyDown(message) {
        const key = message.content

        if (!this[key])
            return

        this[key].style.backgroundColor = "rgba(145,151,151,0.36)"

    }

    keyUp(message) {
        const key = message.content

        if (!this[key])
            return

        this[key].style.backgroundColor = ""
    }

}